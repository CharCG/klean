import { z } from 'zod';
import { roleSchema } from '@/features/user/model/user.schemas';

export const loginPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerPayloadSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
});
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const registerFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  phone: z.string().trim().min(1),
  address: z.string().trim().min(1),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginResponseSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: roleSchema,
  }),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
