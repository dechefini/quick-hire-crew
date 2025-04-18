import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, InfoIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePayment } from '@/contexts/PaymentContext';
import { getFunctions } from 'firebase/functions';
import { authenticatedCallable } from '@/lib/auth-utils';

// Props interface
interface StripeCardManagerProps {
  onUpdate?: () => void;
}

/**
 * A simplified component to manage Stripe payment methods by redirecting to Customer Portal
 */
export function StripeCardManager({ onUpdate }: StripeCardManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { isRecovering } = usePayment();
  const [isLoading, setIsLoading] = useState(false);

  // Handle redirecting to Customer Portal
  const handleManagePayments = async () => {
    if (!user) return;

    try {
      setError(null);
      setIsLoading(true);

      // Use the official Firebase Extension function directly
      const functions = getFunctions();
      const createPortalLinkFn = authenticatedCallable<
        { return_url: string },
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createPortalLink');

      // Call the function with return URL back to the account page
      const { url } = await createPortalLinkFn({
        return_url: window.location.origin + '/account?setup=complete',
      });

      // Redirect to the portal
      window.location.assign(url);
    } catch (err) {
      console.error('Error accessing payment portal:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to access payment portal'
      );
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment information securely through Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isRecovering && (
          <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertTitle>Updating Payment Profile</AlertTitle>
            <AlertDescription className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              We're syncing your payment information. This will only take a
              moment...
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            To manage your payment methods, you'll be redirected to Stripe's
            secure payment portal. There you can add, remove, or update your
            payment information safely.
          </p>
          <p className="text-sm text-gray-600">
            After making changes, you'll be redirected back to this application.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleManagePayments}
          disabled={isRecovering || isLoading}
        >
          {isRecovering || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRecovering ? 'Updating Profile...' : 'Redirecting...'}
            </>
          ) : (
            'Manage Payment Methods'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
