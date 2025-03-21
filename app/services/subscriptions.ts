import { apiService } from './api';
import {
  Subscription,
  SubscriptionRequest,
  Transaction,
  TransactionRequest,
  PaginationParams
} from '../types/api';

export const subscriptionsService = {
  // Operaciones de Suscripción
  async getSubscription(id: string): Promise<Subscription> {
    const response = await apiService.get<Subscription>(`/subscriptions/${id}`);
    return response.data!;
  },

  async createSubscription(data: SubscriptionRequest): Promise<Subscription> {
    const response = await apiService.post<Subscription>('/subscriptions', data);
    return response.data!;
  },

  async updateSubscription(
    id: string,
    data: Partial<SubscriptionRequest>
  ): Promise<Subscription> {
    const response = await apiService.put<Subscription>(`/subscriptions/${id}`, data);
    return response.data!;
  },

  async cancelSubscription(id: string): Promise<void> {
    await apiService.post(`/subscriptions/${id}/cancel`);
  },

  async getSubscriptionPlans(): Promise<{
    plans: Array<{
      id: string;
      name: string;
      price: number;
      features: string[];
      duration: string;
    }>;
  }> {
    const response = await apiService.get<{
      plans: Array<{
        id: string;
        name: string;
        price: number;
        features: string[];
        duration: string;
      }>;
    }>('/subscriptions/plans');
    return response.data!;
  },

  // Operaciones de Transacción
  async createTransaction(data: TransactionRequest): Promise<Transaction> {
    const response = await apiService.post<Transaction>('/transactions', data);
    return response.data!;
  },

  async getTransaction(id: string): Promise<Transaction> {
    const response = await apiService.get<Transaction>(`/transactions/${id}`);
    return response.data!;
  },

  async getTransactions(
    params?: PaginationParams & {
      status?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{
    transactions: Transaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const response = await apiService.getPaginated<Transaction>('/transactions', params);
    return {
      transactions: response.data || [],
      pagination: response.pagination
    };
  },

  async getTransactionMetrics(): Promise<{
    totalTransactions: number;
    totalRevenue: number;
    averageTransactionValue: number;
    successRate: number;
  }> {
    const response = await apiService.get<{
      totalTransactions: number;
      totalRevenue: number;
      averageTransactionValue: number;
      successRate: number;
    }>('/transactions/metrics');
    return response.data!;
  },

  // Operaciones de Facturación
  async getInvoice(id: string): Promise<{
    id: string;
    subscriptionId: string;
    amount: number;
    status: string;
    createdAt: Date;
    dueDate: Date;
    paidAt?: Date;
    items: Array<{
      description: string;
      amount: number;
      quantity: number;
    }>;
  }> {
    const response = await apiService.get<{
      id: string;
      subscriptionId: string;
      amount: number;
      status: string;
      createdAt: Date;
      dueDate: Date;
      paidAt?: Date;
      items: Array<{
        description: string;
        amount: number;
        quantity: number;
      }>;
    }>(`/invoices/${id}`);
    return response.data!;
  },

  async getInvoices(
    params?: PaginationParams & {
      status?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{
    invoices: Array<{
      id: string;
      subscriptionId: string;
      amount: number;
      status: string;
      createdAt: Date;
      dueDate: Date;
      paidAt?: Date;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const response = await apiService.getPaginated<{
      id: string;
      subscriptionId: string;
      amount: number;
      status: string;
      createdAt: Date;
      dueDate: Date;
      paidAt?: Date;
    }>('/invoices', params);
    return {
      invoices: response.data || [],
      pagination: response.pagination
    };
  }
}; 