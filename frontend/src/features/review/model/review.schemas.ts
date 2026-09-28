import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  orderId: z.string(),
  merchantId: z.string(),
  userId: z.string().nullish().transform((value) => value ?? undefined),
  user: z.object({ name: z.string() }).nullish().transform((value) => value ?? undefined),
  merchant: z.object({ name: z.string() }).nullish().transform((value) => value ?? undefined),
  order: z.object({ id: z.string() }).nullish().transform((value) => value ?? undefined),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Review = z.infer<typeof reviewSchema>;
