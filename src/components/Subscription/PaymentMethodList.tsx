import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CustomerPortal } from './CustomerPortal';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

interface PaymentMethod {
  id: string;
  type: string;
  isDefault: boolean;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export const PaymentMethodList: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!user?.uid) {
        setPaymentMethods([]);
        setLoading(false);
        return;
      }

      try {
        // Query Firestore directly for payment methods
        const db = getFirestore();
        const paymentMethodsRef = collection(
          db,
          'customers',
          user.uid,
          'payment_methods'
        );

        // Set up a realtime listener for payment methods
        const unsubscribe = onSnapshot(paymentMethodsRef, (snapshot) => {
          if (snapshot.empty) {
            setPaymentMethods([]);
          } else {
            const methods = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                type: data.type || 'card',
                isDefault: data.isDefault || false,
                card: data.card
                  ? {
                      brand: data.card.brand || 'unknown',
                      last4: data.card.last4 || '****',
                      expMonth: data.card.exp_month || 0,
                      expYear: data.card.exp_year || 0,
                    }
                  : undefined,
              } as PaymentMethod;
            });
            setPaymentMethods(methods);
          }
          setLoading(false);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading payment methods:', error);
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [user]);

  const getCardBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <svg
            className="h-6 w-10"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="24" rx="4" fill="#F9F9F9" />
            <path
              d="M15.4158 15.0629H12.9579L14.5579 8.95459H17.0158L15.4158 15.0629Z"
              fill="#00579F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.7194 9.1039C22.2514 8.9383 21.5076 8.76 20.6001 8.76C18.5156 8.76 17.0314 9.83459 17.0197 11.3693C17.0085 12.518 18.0804 13.1513 18.8927 13.5385C19.7241 13.9343 19.9829 14.1939 19.9801 14.5498C19.9767 15.0861 19.3391 15.3319 18.7435 15.3319C17.9 15.3319 17.4514 15.2059 16.7466 14.9101L16.5027 14.7995L16.2408 16.6118C16.7951 16.8323 17.8213 17.0253 18.8847 17.0378C21.0999 17.0378 22.5526 15.9771 22.5656 14.3367C22.5724 13.4108 21.932 12.7011 20.7013 12.1396C20.0011 11.7831 19.5852 11.5476 19.5887 11.1749C19.5887 10.8493 19.968 10.4994 20.7878 10.4994C21.4786 10.4869 21.9877 10.6481 22.3808 10.8118L22.5566 10.9017L22.8153 9.13458L22.7194 9.1039Z"
              fill="#00579F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.8764 8.9545C25.42 8.9545 25.0573 9.05506 24.8161 9.46911L21.7112 15.0629H23.9264L24.3487 13.95H26.9905L27.2326 15.0629H29.1901L27.6693 8.9545H25.8764ZM24.862 12.3463C24.862 12.3463 25.8205 9.91392 25.9691 9.55435C25.981 9.55435 26.2313 8.97834 26.2313 8.97834L26.4697 9.52306C26.4697 9.52306 27.1085 12.1051 27.2326 12.3463H24.862Z"
              fill="#00579F"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.6493 8.95459L9.61612 13.0304L9.39529 11.8877C9.00293 10.6914 7.85818 9.40118 6.57263 8.76L8.41232 15.0611H10.6428L13.8785 8.95459H11.6493Z"
              fill="#00579F"
            />
            <path
              d="M7.54384 8.95459H4.14053L4.08057 9.13458C7.00294 9.81246 8.88748 11.6667 9.39531 13.0304L8.56068 9.4827C8.43883 9.07461 8.03831 8.96813 7.54384 8.95459Z"
              fill="#FAA61A"
            />
          </svg>
        );
      case 'mastercard':
        return (
          <svg
            className="h-6 w-10"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="24" rx="4" fill="#F9F9F9" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.5254 6H24.4746V18H15.5254V6Z"
              fill="#FF5F00"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.2143 12C16.2143 9.4525 17.4445 7.1925 19.3572 5.7C18.0758 4.6425 16.4637 4 14.7143 4C10.5426 4 7.14282 7.5825 7.14282 12C7.14282 16.4175 10.5426 20 14.7143 20C16.4637 20 18.0758 19.3575 19.3572 18.3C17.4445 16.8075 16.2143 14.5475 16.2143 12Z"
              fill="#EB001B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32.8571 12C32.8571 16.4175 29.4574 20 25.2857 20C23.5362 20 21.9241 19.3575 20.6427 18.3C22.5553 16.8075 23.7855 14.5475 23.7855 12C23.7855 9.4525 22.5553 7.1925 20.6427 5.7C21.9241 4.6425 23.5362 4 25.2857 4C29.4574 4 32.8571 7.5825 32.8571 12Z"
              fill="#F79E1B"
            />
          </svg>
        );
      case 'amex':
        return (
          <svg
            className="h-6 w-10"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="24" rx="4" fill="#F9F9F9" />
            <path
              d="M35.9998 16.5594V16.8005H35.6786V17.6628H35.4172V16.8005H35.0959V16.5594H35.9998Z"
              fill="#016FD0"
            />
            <path
              d="M36.1812 16.5594H36.5022L36.7634 17.1811L37.0248 16.5594H37.3456V17.6626H37.0944V16.8203L36.8232 17.4321H36.7035L36.4324 16.8203V17.6626H36.1812V16.5594Z"
              fill="#016FD0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.1214 7.85855H28.0786V9.19534L27.4393 10.075L28.0786 10.9548V12.2916H26.6429L26.2179 11.7178L25.7929 12.2916H10.6429V8.33284L11.5 7.85855H13.1444L13.5357 8.33284V9.28141H14.1071L14.6786 7.85855H16.7857L17.3571 9.28141L17.7143 7.85855H19.1214ZM19.1214 16.3737H10.6429V11.5838H13.1429L13.85 12.2913L14.5571 11.5838H20.125L21.225 12.7677L22.325 11.5838H28.0786V16.3737H21.8214V14.8002H21.2857V16.3737H19.1214Z"
              fill="#016FD0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27.1786 8.80762H25.3214L24.1071 11.3245H26.0714L26.5 10.5684H26.9286L27.1786 8.80762ZM25.5 9.32619H26.4286L26.1429 10.2909H25.2143L25.5 9.32619Z"
              fill="#016FD0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.5714 8.80762H13.8572L13.1429 10.6245L12.4286 8.80762H11.5V11.3245H12.4286V9.50762H12.6429L13.5 11.3245H14.5714V8.80762H15.3571L16.25 10.8102H17.1786L18.0714 8.80762H18.5714Z"
              fill="#016FD0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.5714 12.2915L24.1071 15.3245H25.25L25.8571 14.0916L26.4643 15.3245H27.6429L26.1786 12.2915H25.5714Z"
              fill="#016FD0"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.6429 12.2915H18.5714L17.85 13.5244L17.1286 12.2915H11.5V15.3245H17.1286L17.85 14.0916L18.5714 15.3245H19.5V14.0916H21.7143C22.4286 14.0916 22.6429 14.3487 22.6429 14.6059V15.3245H23.5714V14.3488C23.5714 13.8345 23.1429 13.5773 22.6429 12.2915ZM18.5714 13.5244H16.9286V12.8059H18.5714V13.5244ZM15.5 14.3487H12.4286V13.5244H15.1429V12.8059H12.4286V12.0873H15.5V14.3487Z"
              fill="#016FD0"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-6 w-10"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="24" rx="4" fill="#F9F9F9" />
            <path
              d="M20 12C20 10.8954 20.8954 10 22 10H28C29.1046 10 30 10.8954 30 12V12C30 13.1046 29.1046 14 28 14H22C20.8954 14 20 13.1046 20 12V12Z"
              fill="#A0A5AF"
            />
            <circle cx="14" cy="12" r="4" fill="#A0A5AF" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No Payment Methods
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You don't have any payment methods on file.
          </p>
          <div className="mt-4">
            <CustomerPortal buttonText="Add Payment Method" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
      </div>

      <ul className="divide-y divide-gray-200">
        {paymentMethods.map((method) => (
          <li key={method.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {method.card && getCardBrandIcon(method.card.brand)}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {method.card?.brand.charAt(0).toUpperCase() +
                      method.card?.brand.slice(1)}{' '}
                    •••• {method.card?.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.card?.expMonth}/{method.card?.expYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {method.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-6 py-5 border-t border-gray-200">
        <CustomerPortal buttonText="Manage Payment Methods" />
      </div>
    </div>
  );
};
