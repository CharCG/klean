import { z } from 'zod';
import { reportSchema } from '../model/report.schemas';
import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';

const reportPayloadSchema = z.object({ issue: z.string().min(1) });
export const reportKeys = { all: ['report'] as const, list: ['report', 'list'] as const };

export async function createReport(orderId: string, payload: { issue: string }) {
  const response = await apiClient.post<unknown>(`/orders/${z.string().parse(orderId)}/reports`, reportPayloadSchema.parse(payload));
  return parseApiData(reportSchema, response.data);
}
export async function getReports() {
  const response = await apiClient.get<unknown>('/reports');
  return parseApiData(z.array(reportSchema), response.data);
}
export async function resolveReport(id: string) {
  const response = await apiClient.patch<unknown>(`/reports/${z.string().parse(id)}`, { status: 'RESOLVED' });
  return parseApiData(reportSchema, response.data);
}
