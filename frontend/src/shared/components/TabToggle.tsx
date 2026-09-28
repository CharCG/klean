import { memo } from 'react';
import { cn } from '@/shared/utils/cn';

interface TabToggleProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const TabToggle = memo(({ tabs, activeTab, onTabChange }: TabToggleProps) => (
  <div role="tablist" className="flex p-1 rounded-xl" style={{ backgroundColor: 'var(--color-stroke)' }}>
    {tabs.map((tab) => (
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === tab.key}
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={cn(
          'flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer',
          activeTab !== tab.key && 'opacity-60 grayscale-[0.5]'
        )}
        style={{
          backgroundColor: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
          color: activeTab === tab.key ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
));

TabToggle.displayName = 'TabToggle';
export default TabToggle;
