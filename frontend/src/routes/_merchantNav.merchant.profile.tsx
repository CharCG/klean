import { createFileRoute } from '@tanstack/react-router';
import MerchantProfile from '@/features/merchant/pages/Profile';

export const Route = createFileRoute('/_merchantNav/merchant/profile')({ component: MerchantProfile });
