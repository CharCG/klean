import { z } from 'zod';
import { applicationPayloadSchema, applicationSchema, type ApplicationPayload } from '../model/application.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';

export const applicationKeys = {
  all: ['application'] as const,
  list: ['application', 'list'] as const,
  detail: (id: string | undefined) => ['application', 'detail', id] as const,
};

export async function submitApplication(payload: ApplicationPayload) {
  const response = await apiClient.post<unknown>('/applications', applicationPayloadSchema.parse(payload));
  return parseApiData(applicationSchema, response.data);
}
export async function getApplications() {
  const response = await apiClient.get<unknown>('/applications');
  return parseApiData(z.array(applicationSchema), response.data);
}
export async function getApplicationById(id: string) {
  const response = await apiClient.get<unknown>(`/applications/${z.string().parse(id)}`);
  return parseApiData(applicationSchema, response.data);
}
export async function decideApplication(id: string, status: 'ACCEPTED' | 'REJECTED') {
  const response = await apiClient.patch<unknown>(`/applications/${z.string().parse(id)}`, { status });
  return parseApiData(applicationSchema, response.data);
}
