import { normalizeAppError } from './app-error';
import { useToast } from '@/shared/stores/toast-store';

export function showErrorToast(error: unknown): void {
  useToast.getState().showToast(normalizeAppError(error).message, 'error');
}
