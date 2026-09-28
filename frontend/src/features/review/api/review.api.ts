import { z } from 'zod';
import { reviewSchema } from '../model/review.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData, parseApiResponse } from '@/shared/api/validation';

const reviewPayloadSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().min(1) });
export const reviewKeys = { all: ['review'] as const, list: ['review', 'list'] as const };

export async function createReview(orderId: string, payload: { rating: number; comment: string }) {
  const response = await apiClient.post<unknown>(`/orders/${z.string().parse(orderId)}/reviews`, reviewPayloadSchema.parse(payload));
  return parseApiData(reviewSchema, response.data);
}
export async function getReviews() {
  const response = await apiClient.get<unknown>('/reviews');
  return parseApiData(z.array(reviewSchema), response.data);
}
export async function deleteReview(id: string) {
  const response = await apiClient.delete<unknown>(`/reviews/${z.string().parse(id)}`);
  return parseApiResponse(response.data);
}
