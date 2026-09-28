import { z } from 'zod';
import { updatedUserSchema, userSchema, type User } from '../model/user.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData, parseApiResponse } from '@/shared/api/validation';

const profileUpdateSchema = userSchema.pick({ name: true, phone: true, address: true }).partial();
const passwordChangeSchema = z.object({ oldPassword: z.string().min(1), newPassword: z.string().min(1) });

export const userKeys = { all: ['user'] as const, profile: ['user', 'profile'] as const };

export async function getProfile() {
  const response = await apiClient.get<unknown>('/users/profile');
  return parseApiData(userSchema, response.data);
}

export async function updateProfile(payload: Partial<Pick<User, 'name' | 'phone' | 'address'>>) {
  const response = await apiClient.put<unknown>('/users/profile', profileUpdateSchema.parse(payload));
  return parseApiData(updatedUserSchema, response.data);
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  const response = await apiClient.patch<unknown>('/users/profile/password', passwordChangeSchema.parse(payload));
  return parseApiResponse(response.data);
}
