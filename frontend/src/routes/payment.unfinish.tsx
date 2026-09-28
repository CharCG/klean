import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import PaymentFinish from '@/features/customer/pages/PaymentFinish';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/payment/unfinish')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  validateSearch: z.object({ order_id: z.string().optional(), orderId: z.string().optional() }),
  component: PaymentFinish,
});
