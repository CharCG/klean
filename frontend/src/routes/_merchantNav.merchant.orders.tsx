import { createFileRoute } from '@tanstack/react-router';
import MerchantOrders from '@/features/merchant/pages/Orders';

export const Route = createFileRoute('/_merchantNav/merchant/orders')({ component: MerchantOrders });
