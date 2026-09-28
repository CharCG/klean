import { createFileRoute } from '@tanstack/react-router';
import MerchantServices from '@/features/merchant/pages/Services';

export const Route = createFileRoute('/_merchantNav/merchant/services')({ component: MerchantServices });
