import { createFileRoute } from '@tanstack/react-router';
import MerchantDetail from '@/features/customer/pages/MerchantDetail';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/merchants/$id')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: MerchantDetail,
});
