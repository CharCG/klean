import { z } from 'zod';
import { bankTypeSchema } from '@/features/merchant/model/merchant.schemas';

export const applicationStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

export const applicationSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  businessOwner: z.string(),
  status: applicationStatusSchema,
  businessPhone: z.string(),
  businessEmail: z.email(),
  businessAddress: z.string(),
  businessDescription: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  bankType: bankTypeSchema,
  bankAccount: z.string(),
  bankHolder: z.string(),
  documentUrl: z.string(),
  userId: z.string().nullish().transform((value) => value ?? undefined),
  user: z.object({ id: z.string().optional(), name: z.string(), email: z.email() }).nullish().transform((value) => value ?? undefined),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Application = z.infer<typeof applicationSchema>;

export const applicationPayloadSchema = applicationSchema.omit({
  id: true,
  status: true,
  userId: true,
  user: true,
  createdAt: true,
  updatedAt: true,
});
export type ApplicationPayload = z.infer<typeof applicationPayloadSchema>;
