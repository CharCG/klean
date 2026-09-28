import { memo } from 'react';
import { AlertTriangle } from '@/shared/icons';
import Button from './Button';
import { getUserErrorMessage } from '@/shared/errors/app-error';

interface ErrorStateProps {
  message?: string;
  error?: unknown;
  onRetry?: () => void;
}

const ErrorState = memo(({ message, error, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <AlertTriangle size={48} style={{ color: 'var(--color-danger)' }} />
    <h3 className="font-semibold mt-4 text-base" style={{ color: 'var(--color-text)' }}>
      {message ?? getUserErrorMessage(error)}
    </h3>
    {onRetry && (
      <Button
        onClick={onRetry}
        variant="secondary"
        size="sm"
        className="mt-4 !px-6"
      >
        Try Again
      </Button>
    )}
  </div>
));

ErrorState.displayName = 'ErrorState';
export default ErrorState;
