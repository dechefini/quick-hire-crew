import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  increment,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { authenticatedCallable } from './auth-utils';

// Types for our Stripe integration
export interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault?: boolean;
}

export interface StripeCustomer {
  customerId: string;
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod?: string;
}

export interface SetupIntentResult {
  clientSecret: string;
  customerId: string;
}

// Custom error class for payment-related errors
export class PaymentError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
  }
}

/**
 * Helper function to delay execution
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Ensures a Stripe customer exists for the user
 * This is the core recovery function used by other functions
 */
export const ensureStripeCustomer = async (
  userId?: string
): Promise<string> => {
  try {
    // Get current user if userId not provided
    if (!userId) {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new PaymentError(
          'You must be logged in to use payment features.',
          'stripe/not-authenticated'
        );
      }
      userId = auth.currentUser.uid;
    }

    // Log the recovery attempt to Firestore
    try {
      const recoveryLogRef = doc(db, `users/${userId}/logs/stripe_recovery`);
      const timestamp = serverTimestamp();

      await setDoc(
        recoveryLogRef,
        {
          attempts: increment(1),
          lastAttemptAt: timestamp,
          triggeredFrom: 'ensureStripeCustomer',
          status: 'started',
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        },
        { merge: true }
      );
    } catch (logError) {
      // Don't fail if logging fails
      console.warn('Failed to log recovery attempt:', logError);
    }

    // Verify user document exists before proceeding
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.error('User document not found, cannot create Stripe customer');
      throw new PaymentError(
        'Your user profile is incomplete. Please complete your profile setup to access payment features.',
        'stripe/incomplete-profile'
      );
    }

    // Check if user has email
    const userData = userDoc.data();
    const email = userData?.email;

    if (!email) {
      console.error('User has no email address, required for Stripe customer');
      throw new PaymentError(
        'An email address is required for payment setup. Please update your profile with an email address.',
        'stripe/missing-email'
      );
    }

    console.log('Ensuring Stripe customer exists for user:', userId);
    const functions = getFunctions();

    // Use the authenticated callable utility with the official extension function
    const createCustomerFn = authenticatedCallable<
      { email: string; name?: string },
      { customerId: string }
    >(functions, 'ext-firestore-stripe-payments-createCustomer');

    const result = await createCustomerFn({
      email,
      name: userData?.fullName || userData?.displayName || '',
    });
    const customerId = result.customerId;
    const created = true; // Assume created for logging purposes

    console.log('Successfully ensured Stripe customer exists:', customerId);

    // Log the successful recovery to Firestore
    try {
      const recoveryLogRef = doc(db, `users/${userId}/logs/stripe_recovery`);

      await updateDoc(recoveryLogRef, {
        status: 'completed',
        customerId,
        customerCreated: created,
        completedAt: serverTimestamp(),
        result: 'success',
      });
    } catch (logError) {
      // Don't fail if logging fails
      console.warn('Failed to log recovery completion:', logError);
    }

    // Update customers collection (newer, official)
    try {
      // Get user email and name for the record
      const email = userData?.email || '';
      const name = userData?.fullName || userData?.displayName || '';

      // Update customers collection
      await updateDoc(doc(db, 'customers', userId), {
        customerId,
        email,
        name,
        updatedAt: serverTimestamp(),
      }).catch(async (error) => {
        // If document doesn't exist, create it
        if (error.code === 'not-found') {
          await setDoc(doc(db, 'customers', userId), {
            customerId,
            email,
            name,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      });

      // Update user document with customerId
      await updateDoc(doc(db, 'users', userId), {
        stripeCustomerId: customerId,
        updatedAt: serverTimestamp(),
      }).catch((updateError) => {
        // Log more detailed error for user document updates
        console.warn(
          'Could not update user document with Stripe customer ID',
          updateError
        );
      });
    } catch (dbError) {
      // Log but continue even if Firestore update fails
      console.error('Error updating Firestore with customer ID:', dbError);
    }

    return customerId;
  } catch (error) {
    console.error('Error ensuring Stripe customer exists:', error);

    // Log the failed recovery to Firestore
    if (userId) {
      try {
        const recoveryLogRef = doc(db, `users/${userId}/logs/stripe_recovery`);

        await updateDoc(recoveryLogRef, {
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          errorCode: error instanceof PaymentError ? error.code : 'unknown',
          failedAt: serverTimestamp(),
          result: 'error',
        });
      } catch (logError) {
        // Don't fail if logging fails
        console.warn('Failed to log recovery failure:', logError);
      }
    }

    // Handle specific error types for better user feedback
    if (error instanceof PaymentError) {
      throw error; // Re-throw payment errors as they're already formatted correctly
    }

    if (error instanceof Error) {
      // Check for specific error messages and convert to PaymentError
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes('not found') ||
        errorMessage.includes('profile')
      ) {
        throw new PaymentError(
          'Your user profile is incomplete. Please complete your profile setup first.',
          'stripe/incomplete-profile'
        );
      }

      if (errorMessage.includes('email')) {
        throw new PaymentError(
          'Your email is missing or invalid. Please update your profile with a valid email address.',
          'stripe/invalid-email'
        );
      }

      if (errorMessage.includes('permission')) {
        throw new PaymentError(
          'You do not have permission to access payment features.',
          'stripe/permission-denied'
        );
      }

      // For Stripe API errors
      if (
        errorMessage.includes('stripe') ||
        errorMessage.includes('customer')
      ) {
        throw new PaymentError(
          'There was an issue with the payment service. Please try again later.',
          'stripe/api-error'
        );
      }
    }

    // Default error
    throw new PaymentError(
      'Unable to set up your payment profile. Please try again later.',
      'stripe/customer-creation-failed'
    );
  }
};

/**
 * Creates a Setup Intent to collect payment method details
 * Updated to use the official extension approach
 */
export const createSetupIntent = async (
  userId: string
): Promise<SetupIntentResult> => {
  try {
    console.log('Using official Stripe extension for payment setup');

    const functions = getFunctions();

    // Use the portal approach with the official extension
    const createPortalLinkFn = authenticatedCallable<
      { return_url: string },
      { url: string }
    >(functions, 'ext-firestore-stripe-payments-createPortalLink');

    // Call the function with return URL back to the account page
    const { url } = await createPortalLinkFn({
      return_url: window.location.origin + '/account?setup=complete',
    });

    // Redirect to the Stripe portal
    window.location.assign(url);

    // Return a fake client secret - this won't be used since we're redirecting
    return {
      clientSecret: 'portal_redirect',
      customerId: 'using_portal_approach',
    };
  } catch (error) {
    console.error('Error creating portal redirect:', error);
    throw new PaymentError(
      'Failed to set up payment method. Please try again.',
      'stripe/setup-failed'
    );
  }
};

/**
 * List payment methods for a user
 * Using the official extension
 */
export const listPaymentMethods = async (
  userId: string
): Promise<PaymentMethod[]> => {
  try {
    console.log('Fetching payment methods for user:', userId);

    // Query the payment methods collection managed by the extension
    const db = getFirestore();
    const paymentMethodsRef = collection(
      db,
      'customers',
      userId,
      'payment_methods'
    );

    const snapshot = await getDocs(paymentMethodsRef);

    if (snapshot.empty) {
      return [];
    }

    // Map the documents to PaymentMethod objects
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        card: data.card || {
          brand: 'unknown',
          last4: '****',
          exp_month: 0,
          exp_year: 0,
        },
        isDefault: data.isDefault || false,
      };
    });
  } catch (error) {
    console.error('Error listing payment methods:', error);
    // Return empty array instead of throwing to avoid blocking the UI
    return [];
  }
};

/**
 * Delete a payment method
 * Using the official Stripe extension
 */
export const deletePaymentMethod = async (
  paymentMethodId: string
): Promise<boolean> => {
  try {
    console.log(
      'Deleting payment method via official extension:',
      paymentMethodId
    );

    const functions = getFunctions();

    // Use the portal approach with the official extension
    const createPortalLinkFn = authenticatedCallable<
      { return_url: string },
      { url: string }
    >(functions, 'ext-firestore-stripe-payments-createPortalLink');

    // Call the function with return URL back to the account page
    const { url } = await createPortalLinkFn({
      return_url: window.location.origin + '/account',
    });

    // Redirect the user to the portal to manage payment methods
    window.location.assign(url);

    // Return true since we're redirecting to portal
    return true;
  } catch (error) {
    console.error('Error starting payment method deletion:', error);
    throw new PaymentError(
      'Failed to start payment method management. Please try again.',
      'stripe/portal-failed'
    );
  }
};

/**
 * Utility to check if an error should trigger customer recovery
 */
function shouldAttemptRecovery(
  errorMessage: string,
  errorCode: string
): boolean {
  const message = errorMessage.toLowerCase();

  // Basic Stripe customer errors
  const customerErrors =
    message.includes('incomplete') ||
    message.includes('not found') ||
    message.includes('no such customer') ||
    message.includes('customer not found') ||
    message.includes('payment profile') ||
    message.includes('stripe customer id not found') ||
    message.includes('resource-exhausted');

  // User profile/data errors
  const profileErrors =
    message.includes('user profile') ||
    message.includes('profile is incomplete') ||
    message.includes('profile setup');

  // Email-related errors
  const emailErrors =
    message.includes('email is required') ||
    message.includes('email address is required') ||
    message.includes('missing email');

  // Permission errors - we shouldn't try recovery for these
  const permissionErrors =
    message.includes('permission denied') ||
    message.includes('not authorized') ||
    message.includes('unauthorized');

  // Error codes
  const recoverableCodes = [
    'stripe/customer-not-found',
    'stripe/setup-failed',
    'stripe/incomplete-profile',
    'stripe/missing-email',
    '400',
    'not-found',
    'failed-precondition',
  ];

  const nonRecoverableCodes = [
    'permission-denied',
    'unauthenticated',
    'auth/not-authenticated',
    'stripe/permission-denied',
  ];

  // If it's a permission error, don't attempt recovery
  if (permissionErrors || nonRecoverableCodes.includes(errorCode)) {
    return false;
  }

  // For profile or email errors, only attempt recovery if they're not explicit validation errors
  // as those require user action
  if (profileErrors || emailErrors) {
    // If it's a specific validation error from our own code, don't try automatic recovery
    if (
      errorCode === 'stripe/incomplete-profile' ||
      errorCode === 'stripe/missing-email'
    ) {
      return false;
    }
    // Otherwise try recovery, it might be a temporary issue
    return true;
  }

  // For regular customer errors or recognized error codes, attempt recovery
  return customerErrors || recoverableCodes.includes(errorCode);
}

/**
 * Set a payment method as the default for a customer
 * Using the official Stripe extension
 */
export const setDefaultPaymentMethod = async (
  userId: string,
  paymentMethodId: string
): Promise<boolean> => {
  try {
    console.log(
      'Setting default payment method via official extension:',
      paymentMethodId
    );

    const functions = getFunctions();

    // Use the portal approach with the official extension
    const createPortalLinkFn = authenticatedCallable<
      { return_url: string },
      { url: string }
    >(functions, 'ext-firestore-stripe-payments-createPortalLink');

    // Call the function with return URL back to the account page
    const { url } = await createPortalLinkFn({
      return_url: window.location.origin + '/account',
    });

    // Redirect the user to the portal to manage payment methods
    window.location.assign(url);

    // Return true since we're redirecting to portal
    return true;
  } catch (error) {
    console.error('Error initiating default payment method setup:', error);
    throw new PaymentError(
      'Failed to start payment method management. Please try again.',
      'stripe/portal-failed'
    );
  }
};

/**
 * React hook for Stripe payment functionality
 */
export function useStripePayments() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [setupIntentData, setSetupIntentData] =
    useState<SetupIntentResult | null>(null);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);

  const refreshPaymentMethods = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const methods = await listPaymentMethods(userId);
      setPaymentMethods(methods);
      return methods;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const setupPaymentMethod = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const setupData = await createSetupIntent(userId);
        setSetupIntentData(setupData);
        return setupData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorCode = err instanceof PaymentError ? err.code : '';

        // Handle specific error types with clear user guidance
        if (err instanceof PaymentError) {
          // Profile completion errors
          if (errorCode === 'stripe/incomplete-profile') {
            setError(
              'Your profile is incomplete. Please complete your profile setup before adding a payment method.'
            );
            toast({
              title: 'Profile Incomplete',
              description:
                'Please complete your profile setup with all required information.',
              variant: 'destructive',
            });
            setLoading(false);
            return null;
          }

          // Email errors
          if (
            errorCode === 'stripe/missing-email' ||
            errorCode === 'stripe/invalid-email'
          ) {
            setError(
              'A valid email address is required for payment setup. Please update your profile.'
            );
            toast({
              title: 'Email Required',
              description:
                'Please add a valid email address to your profile to continue.',
              variant: 'destructive',
            });
            setLoading(false);
            return null;
          }

          // Permission errors
          if (
            errorCode === 'stripe/permission-denied' ||
            errorCode === 'auth/not-authenticated'
          ) {
            setError(
              'You do not have permission to access payment features. Please log in again.'
            );
            toast({
              title: 'Authentication Error',
              description: 'Please log in again to access payment features.',
              variant: 'destructive',
            });
            setLoading(false);
            return null;
          }
        }

        // If this is a recoverable error and we haven't tried recovery yet
        if (
          shouldAttemptRecovery(errorMessage, errorCode) &&
          !recoveryAttempted
        ) {
          setRecoveryAttempted(true);

          try {
            toast({
              title: 'Recovering payment profile',
              description: 'Please wait while we fix your payment profile...',
            });

            await ensureStripeCustomer(userId);
            await delay(500);

            toast({
              title: 'Recovery successful',
              description: 'Your payment profile has been fixed.',
            });

            const setupData = await createSetupIntent(userId);
            setSetupIntentData(setupData);
            setError(null);
            setLoading(false);
            return setupData;
          } catch (recoveryErr) {
            const recoveryMessage =
              recoveryErr instanceof Error
                ? recoveryErr.message
                : String(recoveryErr);

            // If recovery failed due to profile or email issues, provide specific guidance
            if (recoveryErr instanceof PaymentError) {
              const recoveryCode = recoveryErr.code;

              if (recoveryCode === 'stripe/incomplete-profile') {
                setError(
                  'Your profile is incomplete. Please update your profile information.'
                );
                toast({
                  title: 'Profile Update Required',
                  description:
                    'Please complete your profile before trying again.',
                  variant: 'destructive',
                });
              } else if (recoveryCode === 'stripe/missing-email') {
                setError(
                  'An email address is required. Please add an email to your profile.'
                );
                toast({
                  title: 'Email Required',
                  description:
                    'Please add an email address to your profile before trying again.',
                  variant: 'destructive',
                });
              } else {
                setError(recoveryMessage);
                toast({
                  title: 'Recovery failed',
                  description:
                    'Unable to set up payment method. Please try again later.',
                  variant: 'destructive',
                });
              }
            } else {
              setError(recoveryMessage);
              toast({
                title: 'Recovery failed',
                description:
                  'Unable to set up payment method. Please try again later.',
                variant: 'destructive',
              });
            }
          }
        } else {
          setError(errorMessage);
          toast({
            title: 'Payment setup failed',
            description: errorMessage,
            variant: 'destructive',
          });
        }

        setLoading(false);
        return null;
      }
    },
    [toast, recoveryAttempted]
  );

  const removePaymentMethod = useCallback(
    async (paymentMethodId: string, userId: string) => {
      try {
        setLoading(true);
        const success = await deletePaymentMethod(paymentMethodId);

        if (success) {
          toast({
            title: 'Payment method removed',
            description: 'Your payment method has been successfully removed.',
          });
          await refreshPaymentMethods(userId);
        }

        return success;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        toast({
          title: 'Error removing payment method',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshPaymentMethods]
  );

  const setDefaultMethod = useCallback(
    async (paymentMethodId: string, userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const success = await setDefaultPaymentMethod(userId, paymentMethodId);

        if (success) {
          // Update local state - mark the selected payment method as default
          setPaymentMethods((prevMethods) =>
            prevMethods.map((method) => ({
              ...method,
              isDefault: method.id === paymentMethodId,
            }))
          );

          toast({
            title: 'Default payment method updated',
            description: 'Your default payment method has been updated.',
          });

          // Refresh to ensure we have the latest data
          await refreshPaymentMethods(userId);
        }

        return success;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);

        toast({
          title: 'Error updating default payment method',
          description: errorMessage,
          variant: 'destructive',
        });

        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast, refreshPaymentMethods]
  );

  const resetSetupIntent = useCallback(() => {
    setSetupIntentData(null);
    setRecoveryAttempted(false);
  }, []);

  return {
    loading,
    error,
    paymentMethods,
    setupIntentData,
    refreshPaymentMethods,
    setupPaymentMethod,
    removePaymentMethod,
    setDefaultMethod,
    resetSetupIntent,
    hasPaymentMethods: paymentMethods.length > 0,
  };
}

/**
 * Process payment for accepting a job
 * Updated to use the official extension
 */
export const processJobAcceptancePayment = async (
  userId: string,
  applicationId: string,
  jobId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(
      'Processing job acceptance payment for application:',
      applicationId
    );

    if (!userId) {
      throw new PaymentError(
        'User ID is required to process payment',
        'stripe/invalid-user'
      );
    }

    // Ensure user has a Stripe customer using the official extension
    await ensureStripeCustomer(userId);

    // Call the cloud function to process the payment
    const functions = getFunctions();
    const processPaymentCallable = authenticatedCallable<
      { applicationId: string; jobId: string },
      { success: boolean; message?: string }
    >(functions, 'processJobAcceptance');

    const result = await processPaymentCallable({
      applicationId,
      jobId,
    });

    const { success, message } = result;

    if (!success) {
      throw new PaymentError(
        message || 'Payment processing failed',
        'stripe/payment-failed'
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing job acceptance payment:', error);

    // Check if this is a recoverable error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof PaymentError ? error.code : '';

    // Log the payment failure
    try {
      const paymentLogRef = doc(db, `users/${userId}/logs/payment_attempts`);

      await setDoc(
        paymentLogRef,
        {
          attempts: increment(1),
          lastAttemptAt: serverTimestamp(),
          type: 'job_acceptance',
          status: 'failed',
          applicationId,
          jobId,
          error: errorMessage,
          errorCode,
        },
        { merge: true }
      );
    } catch (logError) {
      console.warn('Failed to log payment attempt:', logError);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Add a payment method to the customer account
 * Using the official Stripe extension
 */
export const addPaymentMethod = async (
  userId: string,
  paymentMethodId: string
): Promise<boolean> => {
  try {
    console.log('Adding payment method via official extension');

    const functions = getFunctions();

    // Use the official extension's createPortalLink function
    const createPortalLinkFn = authenticatedCallable<
      { return_url: string },
      { url: string }
    >(functions, 'ext-firestore-stripe-payments-createPortalLink');

    // Call the function with return URL back to the account page
    const { url } = await createPortalLinkFn({
      return_url: window.location.origin + '/account?setup=complete',
    });

    // Redirect the user to the portal to add payment methods
    window.location.assign(url);

    // Return true since we're redirecting to portal
    return true;
  } catch (error) {
    console.error('Error initiating payment method addition:', error);
    throw new PaymentError(
      'Failed to start payment method setup. Please try again.',
      'stripe/portal-failed'
    );
  }
};

/**
 * Remove a payment method from a customer
 * Using the official Stripe extension
 */
export const removePaymentMethod = async (
  userId: string,
  paymentMethodId: string
): Promise<boolean> => {
  try {
    console.log(
      `Removing payment method ${paymentMethodId} for user ${userId}`
    );

    // Log the removal attempt
    try {
      const paymentLogRef = doc(db, `users/${userId}/logs/payment_methods`);

      await setDoc(
        paymentLogRef,
        {
          lastRemoved: paymentMethodId,
          removedAt: serverTimestamp(),
          status: 'processing',
        },
        { merge: true }
      );
    } catch (logError) {
      // Don't fail if logging fails
      console.warn('Failed to log payment method removal attempt:', logError);
    }

    // Use the official extension's createPortalLink function
    const functions = getFunctions();
    const createPortalLinkFn = authenticatedCallable<
      { return_url: string },
      { url: string }
    >(functions, 'ext-firestore-stripe-payments-createPortalLink');

    // Call the function with return URL back to the account page
    const { url } = await createPortalLinkFn({
      return_url: window.location.origin + '/account',
    });

    // Redirect the user to the portal to manage payment methods
    window.location.assign(url);

    // Log successful removal initiation
    try {
      const paymentLogRef = doc(db, `users/${userId}/logs/payment_methods`);

      await updateDoc(paymentLogRef, {
        status: 'portal_redirect',
        completedAt: serverTimestamp(),
      });
    } catch (logError) {
      // Don't fail if logging fails
      console.warn(
        'Failed to log payment method removal portal redirection:',
        logError
      );
    }

    return true;
  } catch (error) {
    console.error('Error removing payment method:', error);

    // Log failed removal
    try {
      const paymentLogRef = doc(db, `users/${userId}/logs/payment_methods`);

      await updateDoc(paymentLogRef, {
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        errorCode: error instanceof PaymentError ? error.code : 'unknown',
        failedAt: serverTimestamp(),
      });
    } catch (logError) {
      // Don't fail if logging fails
      console.warn('Failed to log payment method removal failure:', logError);
    }

    // Rethrow the error
    throw error;
  }
};

/**
 * Get or create a Stripe customer for a user
 * Updated to use the official extension
 */
export const getOrCreateStripeCustomer = async (
  userId: string,
  email?: string,
  name?: string
): Promise<string> => {
  // Simply use the ensureStripeCustomer function which now uses the official extension
  return ensureStripeCustomer(userId);
};

/**
 * Get a Stripe customer's data from Firestore
 */
export const getStripeCustomer = async (
  userId: string
): Promise<StripeCustomer | null> => {
  try {
    console.log('Getting Stripe customer data for user:', userId);

    // Get from the official customers collection
    const customerDoc = await getDoc(doc(db, 'customers', userId));

    if (customerDoc.exists()) {
      return customerDoc.data() as StripeCustomer;
    }

    // If no customer record exists
    return null;
  } catch (error) {
    console.error('Error getting Stripe customer:', error);
    return null;
  }
};

/**
 * Check if a user has a valid payment method
 * Using the official Stripe extension
 */
export const hasValidPaymentMethod = async (
  userId: string
): Promise<boolean> => {
  try {
    // Get the payment methods using the official extension collection
    const db = getFirestore();
    const paymentMethodsRef = collection(
      db,
      'customers',
      userId,
      'payment_methods'
    );

    const snapshot = await getDocs(paymentMethodsRef);

    // Return true if they have any payment methods
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking for valid payment method:', error);

    // Attempt recovery if this is a customerId issue
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof PaymentError ? error.code : '';

    if (shouldAttemptRecovery(errorMessage, errorCode)) {
      try {
        // Attempt recovery by ensuring customer exists using official extension
        await ensureStripeCustomer(userId);

        // Retry checking payment methods
        const db = getFirestore();
        const paymentMethodsRef = collection(
          db,
          'customers',
          userId,
          'payment_methods'
        );

        const snapshot = await getDocs(paymentMethodsRef);
        return !snapshot.empty;
      } catch (recoveryError) {
        console.error(
          'Recovery failed when checking payment method:',
          recoveryError
        );
        return false;
      }
    }

    return false;
  }
};

/**
 * Helper function to get a valid Firebase ID token
 * This ensures authentication for all API calls to Firebase Functions
 */
export const getIdToken = async (): Promise<string> => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new PaymentError(
      'You must be logged in to access this feature',
      'auth/not-authenticated'
    );
  }

  try {
    // Force token refresh if it's expired or about to expire
    return await auth.currentUser.getIdToken(true);
  } catch (error) {
    console.error('Error getting ID token:', error);
    throw new PaymentError(
      'Authentication error. Please try logging in again.',
      'auth/token-error'
    );
  }
};
