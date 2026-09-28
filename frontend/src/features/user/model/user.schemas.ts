import { z } from 'zod';

export const roleSchema = z.enum(['CUSTOMER', 'MERCHANT', 'ADMIN']);
export type Role = z.infer<typeof roleSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: roleSchema,
  name: z.string(),
  phone: z.string(),
  address: z.string().nullish().transform((value) => value ?? ''),
  avatarUrl: z.string().nullish().transform((value) => value ?? undefined),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type User = z.infer<typeof userSchema>;

export const updatedUserSchema = userSchema.omit({ role: true }).extend({ name: z.string() });

export const authUserSchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  address: true,
});
export type AuthUser = z.infer<typeof authUserSchema>;
