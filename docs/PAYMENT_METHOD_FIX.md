# Payment Methods Error Fix

## Issue

The app was encountering errors with the payment methods functionality:

```
index.JZA3aicP.js:4429 Error calling listPaymentMethodsCallable: FirebaseError: internal
```

```
Access to fetch at 'https://us-central1-management-acquisition.cloudfunctions.net/listPaymentMethodsCallable' from origin 'https://quick-hire-crew-app.web.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

These errors were occurring because the application was using custom Cloud Functions (`listPaymentMethodsCallable` and others) instead of the official Firebase Extension for Stripe Payments.

## Solution

### 1. Root Cause

The errors were occurring because:

- The app was trying to call custom Cloud Functions like `listPaymentMethodsCallable` and `deletePaymentMethod`
- These functions were custom implementations outside the official Firebase Extension
- There were CORS issues when accessing these functions from the production domain
- The functions didn't have proper CORS headers configured

### 2. Changes Made

1. **Replaced custom function calls with direct Firestore queries:**

   - Updated `src/lib/stripe-enhanced.ts` to query the Firestore path `customers/{userId}/payment_methods` directly
   - This path is managed by the official Firebase Extension

2. **Updated portal redirection:**

   - Modified `src/contexts/PaymentContext.tsx` to use the official extension's createPortalLink function
   - Removed dynamic imports of `stripeService`
   - Implemented direct calls to `ext-firestore-stripe-payments-createPortalLink`

3. **Updated enhanced payment methods component:**

   - Modified `src/components/PaymentMethodList-enhanced.tsx` to use the Stripe Customer Portal
   - Replaced direct deletion of payment methods with portal redirection
   - Eliminated calls to custom functions like `deletePaymentMethod`

4. **Removed function exports:**
   - Updated `src/index.ts` to remove exports of `listPaymentMethodsCallable`
   - Ensures no other part of the app can import and use this problematic function

### 3. Implementation Details

The key changes involved:

#### A. Replacing direct Cloud Function calls:

```typescript
// Old approach - using custom Cloud Functions
const functions = getFunctions();
const listPaymentMethodsCallable = httpsCallable(
  functions,
  'listPaymentMethodsCallable'
);
const result = await listPaymentMethodsCallable({ uid: userId });
```

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

#### B. Using the official Portal for payment method management:

```typescript
// Old approach - using custom function
const deletePaymentMethodCallable = httpsCallable(
  functions,
  'deletePaymentMethod'
);
await deletePaymentMethodCallable({
  paymentMethodId,
  userId: user.uid,
});
```

```typescript
// New approach - using official Stripe Portal
const createPortalLinkFn = httpsCallable<
  { return_url: string },
  { url: string }
>(functions, 'ext-firestore-stripe-payments-createPortalLink');

const { data } = await createPortalLinkFn({
  return_url: window.location.href,
});

window.location.assign(data.url);
```

### 4. Benefits

- Eliminated CORS issues with direct function calls
- Removed dependence on custom Cloud Functions that weren't configured properly
- Reduced complexity by using the official Firebase Extension
- Better aligned with the Firebase Extension's intended usage
- More reliable payment method management
- Improved user experience by using Stripe's official Customer Portal

## Testing

After implementation, verify that:

1. Accessing the Payment Methods section no longer produces errors
2. Redirecting to the Stripe Customer Portal works correctly
3. The payment process completes successfully
4. No CORS errors appear in the console
