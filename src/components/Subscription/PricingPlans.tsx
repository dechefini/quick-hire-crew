import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getFunctions } from 'firebase/functions';
import { authenticatedCallable } from '../../lib/auth-utils';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
} from 'firebase/firestore';

interface Price {
  id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  interval?: string;
  interval_count?: number;
  type: 'one-time' | 'recurring';
}

interface Product {
  id: string;
  name: string;
  description: string;
  active: boolean;
  images: string[];
  metadata: Record<string, string>;
  prices: Price[];
}

export const PricingPlans: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );
  const { user } = useAuth();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Use Firestore to get products directly
        const db = getFirestore();
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);

        const productsData: Product[] = [];

        for (const productDoc of productsSnapshot.docs) {
          if (!productDoc.data().active) continue;

          // Get prices for this product
          const pricesRef = collection(db, 'products', productDoc.id, 'prices');
          const pricesQuery = query(pricesRef, where('active', '==', true));
          const pricesSnapshot = await getDocs(pricesQuery);

          const prices: Price[] = pricesSnapshot.docs.map((priceDoc) => ({
            id: priceDoc.id,
            ...priceDoc.data(),
          })) as Price[];

          productsData.push({
            id: productDoc.id,
            ...productDoc.data(),
            prices,
          } as Product);
        }

        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadSubscription = async () => {
      if (user?.uid) {
        try {
          // Use Firestore directly to get subscription status
          const db = getFirestore();
          const subscriptionsRef = collection(
            db,
            'customers',
            user.uid,
            'subscriptions'
          );

          // Use onSnapshot to get real-time subscription status
          const unsubscribe = onSnapshot(subscriptionsRef, (snapshot) => {
            // Find the first active or trialing subscription
            const subscription = snapshot.docs.find((doc) => {
              const data = doc.data();
              return data.status === 'active' || data.status === 'trialing';
            });

            setSubscriptionStatus(subscription?.data()?.status || null);
          });

          // Cleanup subscription when component unmounts
          return () => unsubscribe();
        } catch (error) {
          console.error('Error loading subscription:', error);
        }
      } else {
        setSubscriptionStatus(null);
      }
    };

    loadProducts();
    const unsubSubscription = loadSubscription();

    // Cleanup
    return () => {
      if (unsubSubscription) unsubSubscription();
    };
  }, [user]);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to login or show login dialog
      window.location.href = '/login?redirect=pricing';
      return;
    }

    try {
      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createCheckoutSessionFn = authenticatedCallable<
        Record<string, unknown>,
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createCheckoutSession');

      // Call the function with the session parameters
      const { data } = await createCheckoutSessionFn({
        price: priceId,
        success_url: window.location.origin + '/account',
        cancel_url: window.location.origin + '/pricing',
        mode: 'subscription',
        allow_promotion_codes: true,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session: No URL returned');
        // Show an error toast or message to the user
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      // Show an error toast or message to the user
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100); // Stripe amounts are in cents
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          // Find the monthly and yearly prices
          const monthlyPrice = product.prices.find(
            (p) => p.interval === 'month'
          );
          const yearlyPrice = product.prices.find((p) => p.interval === 'year');

          // Get firebaseRole from metadata if available
          const role = product.metadata?.firebaseRole || '';
          const isCurrentPlan =
            user && subscriptionStatus === 'active' && role === user.stripeRole;

          return (
            <div
              key={product.id}
              className={`border rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${isCurrentPlan ? 'border-primary' : ''}`}
            >
              <div className="bg-gray-50 p-6">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
              </div>

              <div className="p-6">
                {monthlyPrice && (
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatCurrency(
                          monthlyPrice.unit_amount,
                          monthlyPrice.currency
                        )}
                      </span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    <button
                      onClick={() => handleSubscribe(monthlyPrice.id)}
                      disabled={isCurrentPlan}
                      className={`mt-4 w-full py-2 px-4 rounded ${
                        isCurrentPlan
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Subscribe Monthly'}
                    </button>
                  </div>
                )}

                {yearlyPrice && (
                  <div className="mt-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatCurrency(
                          yearlyPrice.unit_amount,
                          yearlyPrice.currency
                        )}
                      </span>
                      <span className="text-gray-600 ml-1">/year</span>
                    </div>
                    {monthlyPrice && yearlyPrice && (
                      <div className="text-sm text-green-600 mt-1">
                        Save{' '}
                        {Math.round(
                          100 -
                            ((yearlyPrice.unit_amount / 12) * 100) /
                              monthlyPrice.unit_amount
                        )}
                        %
                      </div>
                    )}
                    <button
                      onClick={() => handleSubscribe(yearlyPrice.id)}
                      disabled={isCurrentPlan}
                      className={`mt-4 w-full py-2 px-4 rounded ${
                        isCurrentPlan
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Subscribe Yearly'}
                    </button>
                  </div>
                )}
              </div>

              {product.metadata && Object.keys(product.metadata).length > 0 && (
                <div className="border-t p-6">
                  <h3 className="font-semibold mb-3">Features</h3>
                  <ul className="space-y-2">
                    {Object.entries(product.metadata)
                      .filter(([key]) => key !== 'firebaseRole')
                      .map(([key, value]) => (
                        <li key={key} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span>{value}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
