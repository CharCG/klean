import { createFileRoute } from '@tanstack/react-router';
import MerchantOrderDetail from '@/features/merchant/pages/OrderDetail';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/merchant/orders/$id')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['MERCHANT']),
  component: MerchantOrderDetail,
});
