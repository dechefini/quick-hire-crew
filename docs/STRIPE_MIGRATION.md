# Stripe Migration Guide

## Overview

This document outlines the migration from legacy Stripe integration methods to the official Firebase Extension for Stripe.

## Official Firebase Extension Functions Used

The following official functions from the Firebase Extension for Stripe Payments are now used:

- **createCustomer**: Creates a Stripe customer object when a new user signs up.
- **createCheckoutSession**: Creates a Checkout session to collect payment details.
- **createPortalLink**: Creates links to the customer portal for payment & subscription management.
- **handleWebhookEvents**: Handles Stripe webhook events to keep subscription statuses in sync.
- **onUserDeleted**: Deletes the Stripe customer object when the user is deleted.
- **onCustomerDataDeleted**: Deletes the Stripe customer when the Firestore document is deleted.

## Migration Notes

### Data Storage Changes

- Legacy data was stored in `stripeCustomers` collection
- New data is stored in the official `customers` collection with subcollections:
  - `customers/{userId}/payment_methods`
  - `customers/{userId}/checkout_sessions`
  - `customers/{userId}/subscriptions`

### API Changes

- All direct Stripe API calls have been replaced with Firebase Extension function calls
- Customer management now uses `ext-firestore-stripe-payments-createCustomer`
- Payment methods management uses the Stripe Customer Portal via `ext-firestore-stripe-payments-createPortalLink`

### Security Improvements

- API keys are now managed through Cloud Secret Manager
- Webhook secrets are securely stored
- Functions use proper authentication and authorization

## Implementation Details

The following files were updated to use the official extension:

- `src/lib/stripe.ts`: Core Stripe integration functions
- `src/services/stripeService.ts`: Service wrapper for Stripe functionality

## Future Considerations

- Optimize payment method fetching once the Firebase Extension improves its API
- Add automated testing for Stripe integration
- Set up monitoring for Stripe-related functions
