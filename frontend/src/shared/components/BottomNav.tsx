import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from '@/shared/router';
import type { IconType } from '@/shared/icons';
import { cn } from '@/shared/utils/cn';

interface NavItem {
  path: string;
  label: string;
  icon: IconType;
}

interface BottomNavProps {
  items: NavItem[];
}

const BottomNav = memo(({ items }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = useCallback(
    (path: string) => {
      // For base paths, only exact match
      if (['/', '/merchant', '/admin'].includes(path)) {
        return location.pathname === path;
      }
      return location.pathname === path || location.pathname.startsWith(path + '/');
    },
    [location.pathname]
  );

  return (
    <div className="absolute bottom-0 w-full z-30 px-4 pb-4">
      <nav
        aria-label="Primary navigation"
        className="flex items-center justify-between rounded-3xl border border-stroke bg-card px-4 py-1.5"
      >
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              type="button"
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all cursor-pointer',
                active
                  ? 'scale-[1.02] text-primary'
                  : 'text-text-secondary hover:text-text'
              )}
            >
              <item.icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});

BottomNav.displayName = 'BottomNav';
export default BottomNav;
