import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getFunctions } from 'firebase/functions';
import { authenticatedCallable } from '../../lib/auth-utils';

interface CustomerPortalProps {
  buttonText?: string;
  className?: string;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  buttonText = 'Manage Subscription',
  className = 'px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark',
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleOpenPortal = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '/login?redirect=account';
      return;
    }

    setLoading(true);
    try {
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

      if (url) {
        window.location.href = url;
      } else {
        console.error('Failed to create portal session: No URL returned');
        // Show error message to user
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      // Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleOpenPortal}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        buttonText
      )}
    </button>
  );
};
