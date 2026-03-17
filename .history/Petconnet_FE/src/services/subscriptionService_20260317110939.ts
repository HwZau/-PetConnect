import { apiClient } from '../apiClient';
import type { ApiResponse } from '../../types';

export interface SubscriptionStatus {
  isPremium: boolean;
  tier: string;
  status: 'inactive' | 'active' | 'expired' | 'cancelled' | 'pending_payment';
  endDate?: string;
}

export interface UpgradeResponse {
  message: string;
  paymentId: string;
  subscriptionId: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CancelResponse {
  message: string;
  subscriptionStatus: string;
}

export const subscriptionService = {
  // Get current subscription status
  async getStatus(): Promise<ApiResponse<SubscriptionStatus>> {
    return apiClient.get('/subscriptions/status');
  },

  // Upgrade to premium
  async upgrade(plan: 'monthly' | 'yearly'): Promise<ApiResponse<UpgradeResponse>> {
    return apiClient.post('/subscriptions/upgrade', { plan });
  },

  // Cancel subscription
  async cancel(): Promise<ApiResponse<CancelResponse>> {
    return apiClient.post('/subscriptions/cancel', {});
  },

  // Check if user is premium
  async isPremium(): Promise<boolean> {
    const response = await this.getStatus();
    return response.success && (response.data?.isPremium ?? false);
  }
};

export default subscriptionService;
