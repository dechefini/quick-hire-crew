# Payment Methods Error Fix

## Issue

The app was encountering an error with the payment methods functionality:

```
index.JZA3aicP.js:4429 Error calling listPaymentMethodsCallable: FirebaseError: internal
```

This error was occurring because the application was using a custom Cloud Function (`listPaymentMethodsCallable`) instead of the official Firebase Extension for Stripe Payments.

## Solution

### 1. Root Cause

The error was occurring because:

- The app was trying to call a Cloud Function named `listPaymentMethodsCallable`
- This function was a custom implementation outside the official Firebase Extension
- There were CORS or permissions issues with the custom implementation

### 2. Changes Made

1. **Replaced custom function calls with direct Firestore queries:**

   - Updated `src/lib/stripe-enhanced.ts` to query the Firestore path `customers/{userId}/payment_methods` directly
   - This path is managed by the official Firebase Extension

2. **Updated portal redirection:**
   - Modified `src/contexts/PaymentContext.tsx` to use the official extension's createPortalLink function
   - Removed dynamic imports of `stripeService`
   - Implemented direct calls to `ext-firestore-stripe-payments-createPortalLink`

### 3. Implementation Details

The key change was moving from:

```typescript
// Old approach - using custom Cloud Functions
const functions = getFunctions();
const listPaymentMethodsCallable = httpsCallable(
  functions,
  'listPaymentMethodsCallable'
);
const result = await listPaymentMethodsCallable({ uid: userId });
```

To:

```typescript
// New approach - using official Stripe Extension collections
const db = getFirestore();
const paymentMethodsRef = collection(
  db,
  'customers',
  userId,
  'payment_methods'
);
const snapshot = await getDocs(paymentMethodsRef);
```

### 4. Benefits

- Eliminated CORS issues with direct function calls
- Reduced complexity by removing custom Firebase Functions
- Better aligned with the Firebase Extension's intended usage
- More reliable payment method management
- Real-time updates through Firestore instead of one-time function calls

## Testing

After implementation, verify that:

1. Accessing the Payment Methods section no longer produces errors
2. Redirecting to the Stripe Customer Portal works correctly
3. The payment process completes successfully
