import { createFileRoute } from '@tanstack/react-router';
import EditProfile from '@/features/customer/pages/EditProfile';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/edit-profile')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: EditProfile,
});
