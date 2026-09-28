import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';
import {
  loginPayloadSchema,
  loginResponseSchema,
  registerPayloadSchema,
  type LoginPayload,
  type RegisterPayload,
} from '../model/auth.schemas';
import { userSchema } from '@/features/user/model/user.schemas';

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<unknown>('/auth/login', loginPayloadSchema.parse(payload));
  return parseApiData(loginResponseSchema, response.data);
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<unknown>('/auth/register', registerPayloadSchema.parse(payload));
  return parseApiData(userSchema, response.data);
}
