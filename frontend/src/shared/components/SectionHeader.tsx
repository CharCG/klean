import { memo } from 'react';
import Button from './Button';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onClick: () => void };
}

const SectionHeader = memo(({ title, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-semibold text-lg text-text">{title}</h2>
    {action && (
      <Button
        onClick={action.onClick}
        variant="ghost"
        size="sm"
        className="!-mr-3 !min-h-11 !px-3 !py-0 !text-primary hover:!bg-transparent hover:!opacity-80"
      >
        {action.label}
      </Button>
    )}
  </div>
));

SectionHeader.displayName = 'SectionHeader';
export default SectionHeader;
