import { z } from 'zod';

export const reportStatusSchema = z.enum(['OPEN', 'RESOLVED']);
export type ReportStatus = z.infer<typeof reportStatusSchema>;

export const reportSchema = z.object({
  id: z.string(),
  issue: z.string(),
  status: reportStatusSchema,
  orderId: z.string(),
  userId: z.string().nullish().transform((value) => value ?? undefined),
  user: z.object({ name: z.string() }).nullish().transform((value) => value ?? undefined),
  order: z.object({
    id: z.string(),
    merchant: z.object({ name: z.string() }).nullish().transform((value) => value ?? undefined),
    customer: z.object({ name: z.string() }).nullish().transform((value) => value ?? undefined),
  }).nullish().transform((value) => value ?? undefined),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Report = z.infer<typeof reportSchema>;
