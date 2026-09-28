import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';
import { fieldLabelClassName } from '@/shared/components/form-field.styles';

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <label className={cn(fieldLabelClassName, className)} {...props} />;
}
