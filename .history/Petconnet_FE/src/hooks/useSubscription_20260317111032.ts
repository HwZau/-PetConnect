import { useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';
import type { SubscriptionStatus } from '../services/subscriptionService';

interface UseSubscriptionReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  isVIP: boolean;
  refreshStatus: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getStatus();
      if (response.success && response.data) {
        setStatus(response.data);
        setError(null);
      } else {
        setError('Failed to fetch subscription status');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading subscription status');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  return {
    status,
    loading,
    error,
    isVIP: status?.isPremium ?? false,
    refreshStatus
  };
};

export default useSubscription;
