import { Outlet } from '@tanstack/react-router';
import {
  AlertTriangle,
  FileText,
  Home,
  List,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
  User,
} from '@/shared/icons';
import BottomNav from '@/shared/components/BottomNav';

const CUSTOMER_NAV = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Search },
  { path: '/orders', label: 'Orders', icon: List },
  { path: '/profile', label: 'Profile', icon: User },
];

const MERCHANT_NAV = [
  { path: '/merchant', label: 'Dashboard', icon: Home },
  { path: '/merchant/orders', label: 'Orders', icon: List },
  { path: '/merchant/services', label: 'Services', icon: ShoppingBag },
  { path: '/merchant/profile', label: 'Profile', icon: User },
];

const ADMIN_NAV = [
  { path: '/admin', label: 'Apps', icon: FileText },
  { path: '/admin/reports', label: 'Reports', icon: AlertTriangle },
  { path: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { path: '/admin/profile', label: 'Profile', icon: Settings },
];

function NavigationLayout({ items }: { items: typeof CUSTOMER_NAV }) {
  return (
    <>
      <Outlet />
      <BottomNav items={items} />
    </>
  );
}

export function CustomerNavigationLayout() {
  return <NavigationLayout items={CUSTOMER_NAV} />;
}

export function MerchantNavigationLayout() {
  return <NavigationLayout items={MERCHANT_NAV} />;
}

export function AdminNavigationLayout() {
  return <NavigationLayout items={ADMIN_NAV} />;
}
