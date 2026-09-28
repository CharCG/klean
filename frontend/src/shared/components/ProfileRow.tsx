import { memo } from 'react';
import type { IconType } from '@/shared/icons';
import { ChevronRight } from '@/shared/icons';

interface ProfileRowProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
  color?: string;
}

const ProfileRow = memo(({ icon: Icon, label, onClick, color }: ProfileRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 active:bg-bg transition-colors border-b border-stroke last:border-0 cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color || 'bg-stroke text-text-secondary'}`}>
        <Icon size={16} />
      </div>
      <span className="font-semibold text-text text-sm">{label}</span>
    </div>
    <ChevronRight size={16} className="text-text-tertiary" />
  </button>
));

ProfileRow.displayName = 'ProfileRow';
export default ProfileRow;
