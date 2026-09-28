import { z } from 'zod';
import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';

export async function verifyPayment(orderId: string) {
  const response = await apiClient.post<unknown>(`/payments/verify/${z.string().parse(orderId)}`);
  return parseApiData(z.object({ status: z.string() }), response.data);
}
