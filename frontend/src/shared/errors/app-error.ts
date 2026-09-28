import axios from 'axios';
import { z } from 'zod';

export type AppErrorCategory =
  | 'validation'
  | 'auth'
  | 'not-found'
  | 'conflict'
  | 'business'
  | 'network'
  | 'server'
  | 'unknown';

const defaultMessages: Record<AppErrorCategory, string> = {
  validation: 'Please check the information and try again.',
  auth: 'Your session is invalid or you do not have access.',
  'not-found': 'The requested data could not be found.',
  conflict: 'This action conflicts with the current data.',
  business: 'This action cannot be completed in the current state.',
  network: 'Unable to connect. Check your internet connection.',
  server: 'The server is temporarily unavailable. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

export class AppError extends Error {
  readonly category: AppErrorCategory;
  readonly status?: number;
  override readonly cause: unknown;

  constructor(category: AppErrorCategory, options?: { status?: number; cause?: unknown; message?: string }) {
    super(options?.message ?? defaultMessages[category]);
    this.name = 'AppError';
    this.category = category;
    this.status = options?.status;
    this.cause = options?.cause;
  }
}

function categoryFromStatus(status: number): AppErrorCategory {
  if (status === 400) return 'business';
  if (status === 401 || status === 403) return 'auth';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  if (status === 422) return 'validation';
  if (status >= 500) return 'server';
  return 'unknown';
}

export function normalizeAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof z.ZodError) return new AppError('validation', { cause: error });
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === undefined) return new AppError('network', { cause: error });
    return new AppError(categoryFromStatus(status), { status, cause: error });
  }
  return new AppError('unknown', { cause: error });
}

export function getUserErrorMessage(error: unknown): string {
  return normalizeAppError(error).message;
}
