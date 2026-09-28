import { createFileRoute } from '@tanstack/react-router';
import Payment from '@/features/customer/pages/Payment';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/payment/$orderId')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: Payment,
});
