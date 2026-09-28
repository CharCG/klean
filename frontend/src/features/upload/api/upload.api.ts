import { z } from 'zod';
import { apiClient } from '@/shared/api/client';
import { parseApiData } from '@/shared/api/validation';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<unknown>('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return parseApiData(z.object({ url: z.string() }), response.data).url;
}
