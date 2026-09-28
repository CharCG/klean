import { createFileRoute } from '@tanstack/react-router';
import EditMerchantProfile from '@/features/merchant/pages/EditProfile';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/merchant/edit-profile')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['MERCHANT']),
  component: EditMerchantProfile,
});
