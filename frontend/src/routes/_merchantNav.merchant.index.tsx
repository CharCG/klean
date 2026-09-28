import { createFileRoute } from '@tanstack/react-router';
import MerchantDashboard from '@/features/merchant/pages/Dashboard';

export const Route = createFileRoute('/_merchantNav/merchant/')({ component: MerchantDashboard });
