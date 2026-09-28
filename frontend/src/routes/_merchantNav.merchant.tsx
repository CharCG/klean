import { createFileRoute } from '@tanstack/react-router';
import { MerchantNavigationLayout } from '@/app/layouts';

export const Route = createFileRoute('/_merchantNav/merchant')({
  component: MerchantNavigationLayout,
});
