import { z } from 'zod';

export const unitTypeSchema = z.enum(['KG', 'PIECE']);
export type UnitType = z.infer<typeof unitTypeSchema>;

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  unit: unitTypeSchema,
  description: z.string(),
  isAvailable: z.boolean(),
});
export type Service = z.infer<typeof serviceSchema>;
