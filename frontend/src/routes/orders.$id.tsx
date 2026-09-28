import { createFileRoute } from '@tanstack/react-router';
import CustomerOrderDetail from '@/features/customer/pages/OrderDetail';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/orders/$id')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: CustomerOrderDetail,
});
