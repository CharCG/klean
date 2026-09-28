import { z } from 'zod';
import { merchantDetailSchema, merchantListItemSchema, merchantSchema, updatedMerchantSchema, type Merchant } from '@/features/merchant/model/merchant.schemas';
import { reviewSchema } from '@/features/review/model/review.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';

const merchantDashboardSchema = z.object({
  totalRevenue: z.number(),
  completedOrders: z.number(),
  averageRating: z.number(),
  totalReviews: z.number(),
  recentReviews: z.array(reviewSchema),
});

export async function getMerchants() {
  const response = await apiClient.get<unknown>('/merchants');
  return parseApiData(z.object({ merchants: z.array(merchantListItemSchema) }), response.data);
}

export async function getMerchantById(id: string) {
  const response = await apiClient.get<unknown>(`/merchants/${z.string().parse(id)}`);
  return parseApiData(merchantDetailSchema, response.data);
}

export async function getMerchantDashboard() {
  const response = await apiClient.get<unknown>('/merchants/me/dashboard');
  return parseApiData(merchantDashboardSchema, response.data);
}

export async function getMerchantProfile() {
  const response = await apiClient.get<unknown>('/merchants/me');
  return parseApiData(merchantSchema, response.data);
}

export async function updateMerchantProfile(payload: Partial<Merchant>) {
  const response = await apiClient.put<unknown>('/merchants/me', merchantSchema.partial().parse(payload));
  return parseApiData(updatedMerchantSchema, response.data);
}
