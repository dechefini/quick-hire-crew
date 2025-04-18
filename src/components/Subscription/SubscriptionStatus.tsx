import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CustomerPortal } from './CustomerPortal';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

interface Subscription {
  id: string;
  status: string;
  current_period_start: {
    seconds: number;
    nanoseconds: number;
  };
  current_period_end: {
    seconds: number;
    nanoseconds: number;
  };
  created: {
    seconds: number;
    nanoseconds: number;
  };
  canceled_at?: {
    seconds: number;
    nanoseconds: number;
  };
  cancel_at_period_end: boolean;
  price: {
    id: string;
    product: string;
    active: boolean;
    currency: string;
    unit_amount: number;
    interval: string;
    interval_count: number;
  };
  prices: Array<{
    id: string;
    product: string;
    active: boolean;
    currency: string;
    unit_amount: number;
    interval: string;
    interval_count: number;
  }>;
  product: {
    id: string;
    active: boolean;
    name: string;
    description: string;
    images: string[];
    metadata: Record<string, string>;
  };
  quantity: number;
  metadata: Record<string, string>;
}

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Set up a real-time listener for the user's subscriptions
    const db = getFirestore();
    const subscriptionsRef = collection(
      db,
      'customers',
      user.uid,
      'subscriptions'
    );

    // Query for active or trialing subscriptions, ordered by creation date
    const activeSubscriptionsQuery = query(
      subscriptionsRef,
      where('status', 'in', ['active', 'trialing']),
      orderBy('created', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      activeSubscriptionsQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setSubscription(null);
        } else {
          // Get the most recent active subscription
          const subscriptionData = snapshot.docs[0].data();
          setSubscription({
            id: snapshot.docs[0].id,
            ...subscriptionData,
          } as Subscription);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading subscription:', error);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, [user]);

  const formatDate = (timestampObj: {
    seconds: number;
    nanoseconds: number;
  }) => {
    if (!timestampObj) return 'N/A';
    const date = new Date(timestampObj.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount / 100); // Stripe amounts are in cents
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No Active Subscription
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You don't have an active subscription. Check out our pricing plans
            to get started.
          </p>
          <div className="mt-4">
            <a
              href="/pricing"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              View Pricing Plans
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Subscription Details
        </h3>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Subscription Plan
            </h4>
            <p className="mt-1 text-lg font-semibold">
              {subscription.product.name}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {subscription.product.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <p className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(subscription.status)}`}
              >
                {subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)}
              </span>
              {subscription.cancel_at_period_end && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Cancels at period end
                </span>
              )}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Current Period
            </h4>
            <p className="mt-1 text-sm">
              {formatDate(subscription.current_period_start)} -{' '}
              {formatDate(subscription.current_period_end)}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Price</h4>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(
                subscription.price.unit_amount,
                subscription.price.currency
              )}
              <span className="text-sm font-normal text-gray-500 ml-1">
                /{subscription.price.interval}
                {subscription.price.interval_count > 1
                  ? ` (${subscription.price.interval_count} ${subscription.price.interval}s)`
                  : ''}
              </span>
            </p>
          </div>

          {subscription.canceled_at && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Canceled On</h4>
              <p className="mt-1 text-sm">
                {formatDate(subscription.canceled_at)}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500">Created</h4>
            <p className="mt-1 text-sm">{formatDate(subscription.created)}</p>
          </div>
        </div>

        <div className="mt-6">
          <CustomerPortal
            buttonText="Manage Subscription"
            className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          />
        </div>
      </div>
    </div>
  );
};
