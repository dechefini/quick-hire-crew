/**
 * Quick Hire Crew - Firebase Functions
 * This file exports all functions used in the application.
 *
 * Uses the Invertase Firestore Stripe Payments extension for Stripe integration.
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

// Initialize Firebase Admin once (before imports that might use it)
admin.initializeApp();

// Import all functions from our modules
import { stripeWebhook } from './stripe-webhooks';
import { createPortalLink } from './stripe-payments';
import { createCheckoutSession } from './checkout-sessions';
import { listPaymentMethods, setDefaultPaymentMethod } from './payment-methods';
import {
  createStripeCustomerOnUserCreate,
  ensureCustomerExists,
  debugStripeCustomer,
} from './customer-management';
import { createStripeCustomer } from './customer-creation';

// Check for Firestore Stripe Payments extension
const stripeExtensionConfigured = true; // The extension manages Stripe secrets

// Log extension status
if (stripeExtensionConfigured) {
  logger.info(
    'Using Firestore Stripe Payments extension for Stripe integration'
  );
} else {
  logger.warn(
    'Stripe extension not detected, some payment functions may not work correctly'
  );
}

// Export all functions
export {
  // Stripe Webhook handler
  stripeWebhook,

  // Customer portal
  createPortalLink,

  // Checkout sessions
  createCheckoutSession,

  // Payment methods
  listPaymentMethods,
  setDefaultPaymentMethod,

  // New customer management functions
  createStripeCustomerOnUserCreate,
  ensureCustomerExists,
  createStripeCustomer,
  debugStripeCustomer,
};

// Export original functions (for backward compatibility)
export * from './payment-functions';
