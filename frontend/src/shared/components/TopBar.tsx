import { memo, type ReactNode } from 'react';
import { ChevronLeft } from '@/shared/icons';
import { useNavigate } from '@/shared/router';
import Button from './Button';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
}

const TopBar = memo(({ title, showBack, onBack, rightAction }: TopBarProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-stroke bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            type="button"
            aria-label="Go back"
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="!h-11 !w-11 !rounded-full !bg-bg !p-0 !text-text-secondary hover:!bg-stroke-medium"
          >
            <ChevronLeft size={20} />
          </Button>
        )}
        <h1 className="font-semibold text-lg text-text">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
