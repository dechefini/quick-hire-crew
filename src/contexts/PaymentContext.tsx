import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  ensureStripeCustomer,
  PaymentMethod,
  PaymentError,
  delay,
} from '../lib/stripe';
import { useToast } from '@/components/ui/use-toast';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface PaymentContextType {
  hasPaymentMethod: boolean;
  paymentLoading: boolean;
  paymentMethods: PaymentMethod[];
  paymentError: string | null;
  isRecovering: boolean;
  refreshPaymentMethods: () => Promise<void>;
  handlePaymentError: (
    error: unknown,
    jobId?: string,
    applicationId?: string
  ) => void;
  clearPaymentError: () => void;
  checkValidPayment: () => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false); // Start with false to avoid loading state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Initialize customer when user logs in
  useEffect(() => {
    if (!user) {
      setHasPaymentMethod(false);
      setPaymentLoading(false);
      setPaymentMethods([]);
      setStripeCustomerId(null);
      setIsRecovering(false);
      return;
    }

    const initialize = async () => {
      try {
        // Ensure the user has a Stripe customer for future payments
        try {
          const customerId = await ensureStripeCustomer(user.uid);
          setStripeCustomerId(customerId);

          // In portal-only approach, we don't try to fetch payment methods
          // We'll handle payments through the Stripe Portal
          setPaymentMethods([]);
          setHasPaymentMethod(false); // We don't know, so default to false
          setPaymentLoading(false);
        } catch (error) {
          console.error('Error ensuring Stripe customer:', error);
          setPaymentLoading(false);
        }
      } catch (error) {
        console.error('Error initializing payment:', error);
        setPaymentError(
          'Failed to initialize payment system. Please try again later.'
        );
        setPaymentLoading(false);
      }
    };

    initialize();
  }, [user]);

  // Refresh payment methods - deliberately simplified for portal-only approach
  const refreshPaymentMethods = async () => {
    if (!user) return;

    // Portal-only approach: we don't try to fetch payment methods directly
    // This avoids CORS errors
    setPaymentMethods([]);
    setHasPaymentMethod(false);
    setPaymentLoading(false);
  };

  // Handle payment errors
  const handlePaymentError = async (
    error: unknown,
    jobId?: string,
    applicationId?: string
  ) => {
    console.error('Payment error:', error);

    // Extract error message
    let errorMessage = 'An error occurred processing your payment.';
    let errorCode = '';

    if (error instanceof PaymentError) {
      errorMessage = error.message;
      errorCode = error.code;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Check if this is a recovery-eligible error
    if (shouldAttemptRecovery(errorMessage, errorCode) && user) {
      // Show a less alarming toast for recoverable errors
      toast({
        title: 'Updating payment profile',
        description:
          "We're updating your payment information. Please try again in a moment.",
        duration: 3000,
      });

      // Attempt recovery in the background
      setIsRecovering(true);
      ensureStripeCustomer(user.uid)
        .then(() => {
          setPaymentError(null);
          toast({
            title: 'Payment profile updated',
            description: 'Please try your payment again.',
            duration: 3000,
          });
        })
        .catch((recoveryError) => {
          console.error('Recovery failed:', recoveryError);
          setPaymentError(errorMessage);

          toast({
            title: 'Payment Failed',
            description: errorMessage,
            variant: 'destructive',
          });
        })
        .finally(() => {
          setIsRecovering(false);
        });

      // Don't show the normal error toast yet
      return;
    }

    // Set the error message
    setPaymentError(errorMessage);

    // Show toast
    toast({
      title: 'Payment Failed',
      description: errorMessage,
      variant: 'destructive',
    });

    // Update database to reflect declined payment (simplified version)
    if (user?.uid) {
      try {
        if (jobId) {
          await updateDoc(doc(db, 'jobs', jobId), {
            paymentStatus: 'failed',
            paymentDeclinedAt: serverTimestamp(),
          });
        }

        if (applicationId) {
          await updateDoc(doc(db, 'applications', applicationId), {
            paymentStatus: 'failed',
            paymentDeclinedAt: serverTimestamp(),
          });
        }

        await updateDoc(doc(db, 'users', user.uid), {
          paymentIssue: true,
          lastPaymentFailure: serverTimestamp(),
        });
      } catch (updateError) {
        console.error('Error updating payment failure status:', updateError);
      }
    }
  };

  // For portal-only approach, these methods redirect to Stripe Portal
  // Instead of trying to call APIs directly
  const removePaymentMethod = async (
    paymentMethodId: string
  ): Promise<boolean> => {
    // In portal-only approach, redirect to Stripe Portal
    redirectToStripePortal();
    return false; // Return false since we're just redirecting
  };

  // Set a payment method as the default - also redirects to portal
  const setDefaultMethod = async (
    paymentMethodId: string
  ): Promise<boolean> => {
    // In portal-only approach, redirect to Stripe Portal
    redirectToStripePortal();
    return false; // Return false since we're just redirecting
  };

  // Helper to redirect to Stripe Portal
  const redirectToStripePortal = async () => {
    if (!user) return;

    try {
      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createPortalLinkFn = httpsCallable<
        { return_url: string },
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createPortalLink');

      // Call the function with return URL back to the account page
      const { url } = await createPortalLinkFn({
        return_url: window.location.origin + '/account',
      });

      // Redirect to the portal
      window.location.assign(url);
    } catch (error) {
      console.error('Error redirecting to Stripe portal:', error);
      toast({
        title: 'Error',
        description: 'Failed to open payment portal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Clear payment error
  const clearPaymentError = () => {
    setPaymentError(null);
  };

  // Check if user has a valid payment method
  const checkValidPayment = async (): Promise<boolean> => {
    // For portal-only approach, we assume payment is valid
    // Actual payment validation happens when a payment is made
    return true;
  };

  // Utility to check if an error should trigger recovery
  function shouldAttemptRecovery(
    errorMessage: string,
    errorCode: string
  ): boolean {
    return (
      errorMessage.includes('incomplete') ||
      errorMessage.includes('not found') ||
      errorMessage.includes('no such customer') ||
      errorMessage.includes('customer not found') ||
      errorMessage.includes('payment profile') ||
      errorMessage.includes('Stripe customer ID not found') ||
      errorMessage.includes('resource-exhausted') ||
      errorCode === 'stripe/customer-not-found' ||
      errorCode === 'stripe/setup-failed' ||
      errorCode === 'not-found' ||
      errorCode === 'failed-precondition'
    );
  }

  const value = {
    hasPaymentMethod,
    paymentLoading,
    paymentMethods,
    paymentError,
    isRecovering,
    refreshPaymentMethods,
    handlePaymentError,
    clearPaymentError,
    checkValidPayment,
    removePaymentMethod,
    setDefaultPaymentMethod: setDefaultMethod,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

// Hook to use the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
