import { httpsCallable, getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  getFirestore,
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Custom Payment Error class
class PaymentError extends Error {
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
 * Utility function for handling Stripe customer recovery
 * @returns Promise<string> The customer ID after recovery
 */
export const ensureStripeCustomer = async (): Promise<string> => {
  try {
    console.warn('Attempting Stripe customer recovery...');
    const functions = getFunctions();
    const ensureStripeCustomerCallable = httpsCallable(
      functions,
      'ensureStripeCustomer'
    );

    const result = await ensureStripeCustomerCallable({});
    const { customerId, created } = result.data as {
      customerId: string;
      created: boolean;
    };

    if (created) {
      console.log('Created new Stripe customer during recovery:', customerId);
    } else {
      console.log(
        'Retrieved existing Stripe customer during recovery:',
        customerId
      );
    }

    return customerId;
  } catch (error) {
    console.error('Stripe customer recovery failed:', error);
    throw new PaymentError(
      'Unable to set up your payment profile. Please try again later.',
      'stripe/customer-recovery-failed'
    );
  }
};

/**
 * Create a setup intent for adding a new payment method
 */
export const createSetupIntent = async (
  userId: string
): Promise<{
  clientSecret: string;
  customerId: string;
}> => {
  try {
    const functions = getFunctions();
    const createSetupIntentCallable = httpsCallable(
      functions,
      'createSetupIntent'
    );

    const result = await createSetupIntentCallable({ userId });
    const { clientSecret, customerId } = result.data as {
      clientSecret: string;
      customerId: string;
    };

    if (!clientSecret) {
      throw new Error('No client secret returned from server');
    }

    return {
      clientSecret,
      customerId,
    };
  } catch (error) {
    console.error('Error creating setup intent:', error);

    // Check if error indicates missing/incomplete Stripe customer
    const errorMessage = error instanceof Error ? error.message : String(error);
    const status = error instanceof Error && 'code' in error ? error.code : '';

    if (
      errorMessage.includes('incomplete') ||
      errorMessage.includes('Stripe customer ID not found') ||
      status === 'resource-exhausted' ||
      status === 400
    ) {
      try {
        // Attempt recovery
        console.warn(
          'Attempting auto-fix: creating missing Stripe customer profile...'
        );
        await ensureStripeCustomer();

        // Wait before retrying
        await delay(500);

        // Retry the setup intent creation
        console.log(
          'Retrying setup intent creation after customer recovery...'
        );
        const functions = getFunctions();
        const createSetupIntentCallable = httpsCallable(
          functions,
          'createSetupIntent'
        );

        const retryResult = await createSetupIntentCallable({ userId });
        const { clientSecret, customerId } = retryResult.data as {
          clientSecret: string;
          customerId: string;
        };

        if (!clientSecret) {
          throw new Error(
            'No client secret returned from server after recovery'
          );
        }

        console.log('Successfully recovered and created setup intent!');
        return {
          clientSecret,
          customerId,
        };
      } catch (recoveryError) {
        console.error('Recovery attempt failed:', recoveryError);
        throw new PaymentError(
          'Unable to set up payment method. Please try again later.',
          'stripe/setup-failed-after-recovery'
        );
      }
    }

    // If it's not a recoverable error or recovery failed
    if (error instanceof PaymentError) {
      throw error;
    }

    throw new PaymentError(
      'Failed to initialize payment setup. Please try again.',
      'stripe/setup-failed'
    );
  }
};

/**
 * Sync payment methods from Stripe to local state
 */
export const listPaymentMethods = async (
  userId: string
): Promise<PaymentMethod[]> => {
  try {
    // Query Firestore directly for payment methods using the official Stripe Extension path
    const db = getFirestore();
    const paymentMethodsRef = collection(
      db,
      'customers',
      userId,
      'payment_methods'
    );

    // Get payment methods
    const snapshot = await getDocs(paymentMethodsRef);

    if (snapshot.empty) {
      return [];
    }

    // Map the documents to PaymentMethod objects
    const methods = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || 'card',
        card: data.card || {
          brand: 'unknown',
          last4: '****',
          exp_month: 0,
          exp_year: 0,
        },
        isDefault: data.isDefault || false,
      };
    });

    return methods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);

    // Check if error indicates missing/incomplete Stripe customer
    const errorMessage = error instanceof Error ? error.message : String(error);
    const status = error instanceof Error && 'code' in error ? error.code : '';

    if (
      errorMessage.includes('incomplete') ||
      errorMessage.includes('Stripe customer ID not found') ||
      status === 'resource-exhausted' ||
      status === 400
    ) {
      try {
        // Attempt recovery
        console.warn(
          'Attempting auto-fix: creating missing Stripe customer profile...'
        );
        await ensureStripeCustomer();

        // Wait before retrying
        await delay(500);

        // Retry fetching payment methods directly from Firestore
        console.log(
          'Retrying payment methods fetch after customer recovery...'
        );

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
        const methods = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type || 'card',
            card: data.card || {
              brand: 'unknown',
              last4: '****',
              exp_month: 0,
              exp_year: 0,
            },
            isDefault: data.isDefault || false,
          };
        });

        console.log('Successfully recovered and fetched payment methods!');
        return methods;
      } catch (recoveryError) {
        console.error('Recovery attempt failed:', recoveryError);
        return []; // Return empty array instead of throwing
      }
    }

    // For other errors, return empty array
    return [];
  }
};

// Types
export interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault: boolean;
}

// We're exporting with aliases so we don't conflict with existing functions
export {
  PaymentError,
  createSetupIntent as createSetupIntentEnhanced,
  listPaymentMethods as listPaymentMethodsEnhanced,
};
