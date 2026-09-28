import { z } from 'zod';
import { createOrderPayloadSchema, orderSchema, updatedOrderSchema, type CreateOrderPayload } from '../model/order.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';

export const orderKeys = {
  all: ['order'] as const,
  customerList: ['order', 'customer', 'list'] as const,
  merchantList: ['order', 'merchant', 'list'] as const,
  detail: (id: string | undefined) => ['order', 'detail', id] as const,
};

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiClient.post<unknown>('/orders', createOrderPayloadSchema.parse(payload));
  return parseApiData(z.object({
    order: orderSchema,
    payment: z.object({ snapToken: z.string(), snapRedirectUrl: z.string() }),
  }), response.data);
}

export async function getCustomerOrders() {
  const response = await apiClient.get<unknown>('/orders/mine');
  return parseApiData(z.array(orderSchema), response.data);
}

export async function getMerchantOrders(status?: string) {
  const response = await apiClient.get<unknown>('/orders/merchant', { params: status ? { status } : undefined });
  return parseApiData(z.array(orderSchema), response.data);
}

export async function getOrderById(id: string) {
  const response = await apiClient.get<unknown>(`/orders/${z.string().parse(id)}`);
  return parseApiData(orderSchema, response.data);
}

export async function confirmOrderReceived(orderId: string) {
  const response = await apiClient.patch<unknown>(`/orders/${z.string().parse(orderId)}/confirm`);
  return parseApiData(updatedOrderSchema, response.data);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const response = await apiClient.patch<unknown>(`/orders/${z.string().parse(orderId)}/status`, { status });
  return parseApiData(updatedOrderSchema, response.data);
}

export async function updateOrderEta(orderId: string, estimationTime: string) {
  const response = await apiClient.patch<unknown>(`/orders/${z.string().parse(orderId)}/eta`, { estimationTime });
  return parseApiData(updatedOrderSchema, response.data);
}
