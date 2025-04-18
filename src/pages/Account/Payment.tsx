import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Payment.css';
import { getFunctions } from 'firebase/functions';
import { authenticatedCallable } from '../../lib/auth-utils';

const Payment: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenCustomerPortal = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createPortalLinkFn = authenticatedCallable<
        { return_url: string },
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createPortalLink');

      // Call the function with return URL back to the account page
      const { url } = await createPortalLinkFn({
        return_url: window.location.origin + '/account',
      });

      // Redirect to the portal
      window.location.assign(url);
    } catch (err) {
      console.error('Error opening customer portal:', err);
      setError('Failed to open customer portal. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-methods-container">
      <h2>Payment Methods</h2>
      <p>Manage your payment information securely through Stripe</p>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="py-6">
        <p className="mb-4">
          To manage your payment methods, you'll be redirected to Stripe's
          secure payment portal. There you can add, remove, or update your
          payment information safely.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          After making changes, you'll be redirected back to this application.
        </p>

        <div className="payment-actions">
          <button
            onClick={handleOpenCustomerPortal}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Redirecting...' : 'Manage Payment Methods'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
