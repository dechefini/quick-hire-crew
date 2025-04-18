import React, { useState } from 'react';
import { getFunctions } from 'firebase/functions';
import { authenticatedCallable } from '../../lib/auth-utils';
import '../../styles/Payment.css';

interface AddPaymentMethodProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddPaymentMethod: React.FC<AddPaymentMethodProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPaymentMethod = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the current URL for success and cancel redirects
      const successUrl = `${window.location.origin}/account?payment=success`;
      const cancelUrl = `${window.location.origin}/account?payment=canceled`;

      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createPortalLinkFn = authenticatedCallable<
        { return_url: string },
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createPortalLink');

      // Call the function with return URL back to the account page
      const { url } = await createPortalLinkFn({
        return_url: successUrl,
      });

      // Redirect to the portal
      window.location.assign(url);

      // Note: The above function will redirect the user to Stripe's portal
      // so the code below will only execute if there's an issue with the redirect
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to set up payment method:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to set up payment method. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-method-container">
      <h2>Add Payment Method</h2>
      <p>
        Add a credit card to your account for future payments and subscriptions.
      </p>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleAddPaymentMethod}
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Loading...' : 'Add Payment Method'}
      </button>
    </div>
  );
};

export default AddPaymentMethod;
