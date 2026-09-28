import { createFileRoute } from '@tanstack/react-router';
import WriteReview from '@/features/customer/pages/WriteReview';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/review/$orderId')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: WriteReview,
});
