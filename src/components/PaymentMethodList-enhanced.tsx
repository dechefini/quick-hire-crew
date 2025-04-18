import React, { useState } from 'react';
import { PaymentMethod } from '../lib/stripe-enhanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, CreditCard } from 'lucide-react';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onRefresh: () => Promise<void>;
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  paymentMethods,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const functions = getFunctions();

  const handleManagePaymentMethods = async () => {
    if (!user) return;

    try {
      setIsRedirecting(true);

      // Use the official Firebase Extension function directly
      const createPortalLinkFn = httpsCallable<
        { return_url: string },
        { url: string }
      >(functions, 'ext-firestore-stripe-payments-createPortalLink');

      // Call the function with return URL back to the current page
      const { data } = await createPortalLinkFn({
        return_url: window.location.href,
      });

      // Redirect to the Stripe Portal to manage payment methods
      window.location.assign(data.url);
    } catch (error) {
      console.error('Error redirecting to payment portal:', error);
      toast.error('Failed to open payment management portal');
      setIsRedirecting(false);
    }
  };

  const getCardIcon = (brand: string) => {
    return <CreditCard className="h-5 w-5 text-blue-500 mr-2" />;
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <Card key={method.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center">
              {getCardIcon(method.card.brand)}
              {method.card.brand.charAt(0).toUpperCase() +
                method.card.brand.slice(1)}
              <span className="ml-2 text-sm text-gray-500">
                •••• {method.card.last4}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Expires: {method.card.exp_month}/{method.card.exp_year}
            </p>
          </CardContent>
        </Card>
      ))}

      <div className="mt-4">
        <Button
          onClick={handleManagePaymentMethods}
          disabled={isRedirecting}
          className="w-full"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            <>Manage Payment Methods</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodList;
