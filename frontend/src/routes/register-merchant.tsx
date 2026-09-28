import { createFileRoute } from '@tanstack/react-router';
import RegisterMerchant from '@/features/customer/pages/RegisterMerchant';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/register-merchant')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: RegisterMerchant,
});
