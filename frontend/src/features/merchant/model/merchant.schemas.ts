import { z } from 'zod';
import { serviceSchema } from '@/features/service/model/service.schemas';

export const bankTypeSchema = z.enum(['BCA', 'BRI', 'MANDIRI', 'BNI', 'DANAMON', 'CIMB', 'OCBC']);
export type BankType = z.infer<typeof bankTypeSchema>;

export const merchantListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number(),
  address: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  logoUrl: z.string().nullish().transform((value) => value ?? undefined),
  bannerUrl: z.string().nullish().transform((value) => value ?? undefined),
});
export type MerchantListItem = z.infer<typeof merchantListItemSchema>;

export const merchantSchema = merchantListItemSchema.extend({
  businessPhone: z.string(),
  businessEmail: z.email(),
  businessDescription: z.string(),
  bankName: bankTypeSchema,
  bankAccount: z.string(),
  bankHolder: z.string(),
  services: z.array(serviceSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Merchant = z.infer<typeof merchantSchema>;

export const merchantDetailSchema = merchantListItemSchema.extend({
  businessPhone: z.string(),
  businessEmail: z.email(),
  businessDescription: z.string(),
  services: z.array(serviceSchema).optional(),
});

export const updatedMerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  businessPhone: z.string(),
  businessDescription: z.string(),
  logoUrl: z.string().nullish().transform((value) => value ?? undefined),
  bannerUrl: z.string().nullish().transform((value) => value ?? undefined),
});
