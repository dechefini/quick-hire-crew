import React, { useState, useEffect } from 'react';
import { getFunctions } from 'firebase/functions';
import { authenticatedCallable } from '../../lib/auth-utils';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import '../../styles/Payment.css';

// Simple interface for a product and its price
interface ProductWithPrice {
  id: string;
  name: string;
  description?: string;
  prices: {
    id: string;
    currency: string;
    unit_amount: number;
    type: 'one_time' | 'recurring';
    interval?: string;
  }[];
}

const TestPayment: React.FC = () => {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load products when component mounts
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get products directly from Firestore
      const db = getFirestore();
      const productsRef = collection(db, 'products');
      const productsSnapshot = await getDocs(
        query(productsRef, where('active', '==', true))
      );

      const productsData: ProductWithPrice[] = [];

      for (const productDoc of productsSnapshot.docs) {
        // Get prices for this product
        const pricesRef = collection(db, 'products', productDoc.id, 'prices');
        const pricesQuery = query(pricesRef, where('active', '==', true));
        const pricesSnapshot = await getDocs(pricesQuery);

        // Map prices to our interface
        const prices = pricesSnapshot.docs.map((priceDoc) => {
          const priceData = priceDoc.data();
          return {
            id: priceDoc.id,
            currency: priceData.currency || 'USD',
            unit_amount: priceData.unit_amount || 0,
            type: priceData.type || 'one_time',
            interval: priceData.interval,
          };
        });

        // Only add products with prices
        if (prices.length > 0) {
          productsData.push({
            id: productDoc.id,
            name: productDoc.data().name || 'Unnamed Product',
            description: productDoc.data().description,
            prices,
          });
        }
      }

      setProducts(productsData);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneTimePayment = async (priceId: string) => {
    try {
      // Get success and cancel URLs
      const successUrl = `${window.location.origin}/payment?result=success`;
      const cancelUrl = `${window.location.origin}/payment?result=canceled`;

      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createCheckoutSessionFn = authenticatedCallable<
        Record<string, unknown>,
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createCheckoutSession');

      // Call the function with the session parameters for one-time payment
      const { data } = await createCheckoutSessionFn({
        price: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: 'payment',
      });

      // Redirect to checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError('Failed to create payment. Please try again.');
    }
  };

  const handleSubscription = async (priceId: string) => {
    try {
      // Get success and cancel URLs
      const successUrl = `${window.location.origin}/payment?result=success`;
      const cancelUrl = `${window.location.origin}/payment?result=canceled`;

      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createCheckoutSessionFn = authenticatedCallable<
        Record<string, unknown>,
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createCheckoutSession');

      // Call the function with the session parameters for subscription
      const { data } = await createCheckoutSessionFn({
        price: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: 'subscription',
        allow_promotion_codes: true,
      });

      // Redirect to checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to create subscription. Please try again.');
    }
  };

  // Format price for display
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={loadProducts} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <div className="test-payment-container">
      <h2>Test Payments</h2>
      <p>Try our payment integration with these test products:</p>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>

            <div className="product-prices">
              {product.prices.map((price) => (
                <div key={price.id} className="price-item">
                  <div className="price-info">
                    <span className="price-amount">
                      {formatPrice(price.unit_amount, price.currency)}
                    </span>
                    {price.type === 'recurring' && price.interval && (
                      <span className="price-interval">/ {price.interval}</span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      price.type === 'recurring'
                        ? handleSubscription(price.id)
                        : handleOneTimePayment(price.id)
                    }
                    className="btn btn-primary"
                  >
                    {price.type === 'recurring' ? 'Subscribe' : 'Purchase'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPayment;
