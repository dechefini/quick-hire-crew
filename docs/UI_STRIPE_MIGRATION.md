# UI Components Stripe Migration

## Overview

This document outlines the migration of UI components from using the custom `stripeService` to directly using the official Firebase Extension for Stripe Payments.

## Components Updated

The following components were updated to use the official Firebase Extensions:

1. **Account/Payment.tsx**: Updated to use `ext-firestore-stripe-payments-createPortalLink` directly
2. **StripeCardManager.tsx**: Replaced dynamic import of stripeService with direct Firebase Extension function call
3. **CustomerPortal.tsx**: Now uses `ext-firestore-stripe-payments-createPortalLink` directly
4. **PricingPlans.tsx**: Completely refactored to use Firestore directly for products, prices, and subscriptions
5. **PaymentMethodList.tsx**: Now queries Firestore directly for payment methods under the customers collection
6. **AddPaymentMethod.tsx**: Updated to use `ext-firestore-stripe-payments-createPortalLink` directly
7. **SubscriptionStatus.tsx**: Now uses Firestore real-time listeners for subscription status
8. **TestPayment.tsx**: Updated to query products directly from Firestore and use `ext-firestore-stripe-payments-createCheckoutSession`

## Key Changes

### Data Access Pattern Change

- Before:

  ```javascript
  // Using the custom service
  import { stripeService } from '../../services/stripeService';

  // Get data
  const data = await stripeService.someMethod();
  ```

- After:

  ```javascript
  // Using Firebase directly
  import { getFirestore, collection, query, ... } from 'firebase/firestore';
  import { getFunctions } from 'firebase/functions';
  import { authenticatedCallable } from '../../lib/auth-utils';

  // Get data directly from Firestore
  const db = getFirestore();
  const dataRef = collection(db, 'collection_path');
  const snapshot = await getDocs(dataRef);

  // Use official functions
  const functions = getFunctions();
  const officialFunction = authenticatedCallable(functions, 'ext-firestore-stripe-payments-functionName');
  ```

### Benefits

1. Direct integration with Firebase Extension eliminates custom code
2. Better type checking and error handling
3. Simplified data flow that matches the Firebase Extension's intended use
4. Real-time subscription updates with Firestore listeners
5. Improved security through official authentication and authorization

## Implementation Notes

### Firestore Paths

The official Stripe Extension uses these paths:

- `customers/{userId}` - Customer information
- `customers/{userId}/payment_methods` - Payment methods
- `customers/{userId}/subscriptions` - Subscriptions
- `products` - Products configuration
- `products/{productId}/prices` - Price configurations

### Function Names

The official Firebase Extension functions:

- `ext-firestore-stripe-payments-createCustomer`
- `ext-firestore-stripe-payments-createCheckoutSession`
- `ext-firestore-stripe-payments-createPortalLink`
