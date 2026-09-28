import { useToast } from '@/shared/stores/toast-store';
import { CheckCircle, XCircle, Info } from '@/shared/icons';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const COLORS = {
  success: { bg: 'var(--color-success-light)', border: 'var(--color-success)', text: 'var(--color-success)' },
  error: { bg: 'var(--color-danger-light)', border: 'var(--color-danger)', text: 'var(--color-danger)' },
  info: { bg: 'var(--color-card)', border: 'var(--color-stroke-medium)', text: 'var(--color-text)' },
};

export default function Toast() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" className="fixed top-4 left-1/2 z-[9999] flex w-[90%] -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        const color = COLORS[toast.type];
        return (
          <button
            type="button"
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium cursor-pointer animate-[slideDown_0.3s_ease-out]"
            style={{
              backgroundColor: color.bg,
              border: `1px solid ${color.border}`,
              color: color.text,
            }}
          >
            <Icon size={18} />
            <span className="flex-1">{toast.message}</span>
          </button>
        );
      })}
    </div>
  );
}
