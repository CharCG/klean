import { memo } from 'react';
import type { IconType } from '@/shared/icons';

interface ToggleRowProps {
  icon: IconType;
  label: string;
  isActive: boolean;
  onToggle: () => void;
  showBorder?: boolean;
}

const ToggleRow = memo(({ icon: Icon, label, isActive, onToggle, showBorder = true }: ToggleRowProps) => (
  <div
    className="w-full flex items-center justify-between p-4 transition-colors"
    style={{ borderBottom: showBorder ? '1px solid var(--color-stroke)' : 'none' }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-stroke)', color: 'var(--color-text-secondary)' }}
      >
        <Icon size={16} />
      </div>
      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
        {label}
      </span>
    </div>
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isActive}
      aria-label={label}
      className="w-12 h-6 rounded-full relative transition-colors cursor-pointer"
      style={{ backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-stroke-medium)' }}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  </div>
));

ToggleRow.displayName = 'ToggleRow';
export default ToggleRow;
