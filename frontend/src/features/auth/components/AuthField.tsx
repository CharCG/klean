import { useState, type InputHTMLAttributes } from 'react';
import type { IconType } from '@/shared/icons';
import { Eye, EyeOff } from '@/shared/icons';
import { FieldLabel } from '@/shared/components/FormField';
import { fieldControlClassName } from '@/shared/components/form-field.styles';
import { cn } from '@/shared/utils/cn';

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: string;
  icon: IconType;
}

export default function AuthField({ id, label, icon: Icon, type = 'text', ...props }: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordField = type === 'password';
  const resolvedType = passwordField && passwordVisible ? 'text' : type;

  return (
    <div>
      <FieldLabel htmlFor={id}>
        {label}
      </FieldLabel>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
          aria-hidden="true"
        />
        <input
          {...props}
          id={id}
          type={resolvedType}
          className={cn(fieldControlClassName, 'pl-11 pr-12')}
        />
        {passwordField && (
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? 'Hide Password' : 'Show Password'}
            aria-pressed={passwordVisible}
            className="absolute right-0.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-text-secondary hover:bg-stroke focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary"
          >
            {passwordVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
