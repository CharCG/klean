import { createFileRoute } from '@tanstack/react-router';
import Checkout from '@/features/customer/pages/Checkout';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/checkout')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: Checkout,
});
