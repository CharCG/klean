import { createFileRoute } from '@tanstack/react-router';
import CustomerOrders from '@/features/customer/pages/Orders';

export const Route = createFileRoute('/_customerNav/orders')({ component: CustomerOrders });
