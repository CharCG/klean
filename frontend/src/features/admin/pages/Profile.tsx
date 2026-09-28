import { useAuth } from '@/features/auth/model/use-auth';
import { useTheme } from '@/shared/stores/theme-store';
import TopBar from '@/shared/components/TopBar';
import ToggleRow from '@/shared/components/ToggleRow';
import { Moon, LogOut } from '@/shared/icons';
import Button from '@/shared/components/Button';

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Profile" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary text-xl font-bold" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{user?.name?.charAt(0) || 'A'}</div>
          <div><h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{user?.name || 'Admin'}</h2><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p></div>
        </div>
        <h3 className="font-semibold text-sm px-1 mb-3 mt-2" style={{ color: 'var(--color-text)' }}>Preferences</h3>
        <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <ToggleRow icon={Moon} label="Appearance" isActive={theme === 'dark'} onToggle={toggleTheme} showBorder={false} />
        </div>

        <Button
          type="button"
          onClick={logout}
          variant="danger"
          fullWidth
          className="mt-4 gap-2"
        >
          <LogOut size={18} /> Log Out
        </Button>
      </div>
    </div>
  );
}
