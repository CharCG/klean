import { z } from 'zod';
import { serviceSchema, type Service } from '../model/service.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData, parseApiResponse } from '@/shared/api/validation';

const createServiceSchema = serviceSchema.omit({ id: true, isAvailable: true });

export const serviceKeys = { all: ['service'] as const, list: ['service', 'list'] as const };

export async function getServices() {
  const response = await apiClient.get<unknown>('/services');
  return parseApiData(z.array(serviceSchema), response.data);
}

export async function createService(payload: Omit<Service, 'id' | 'isAvailable'>) {
  const response = await apiClient.post<unknown>('/services', createServiceSchema.parse(payload));
  return parseApiData(serviceSchema, response.data);
}

export async function updateService(id: string, payload: Partial<Service>) {
  const response = await apiClient.put<unknown>(`/services/${z.string().parse(id)}`, serviceSchema.partial().parse(payload));
  return parseApiData(serviceSchema, response.data);
}

export async function deleteService(id: string) {
  const response = await apiClient.delete<unknown>(`/services/${z.string().parse(id)}`);
  return parseApiResponse(response.data);
}
