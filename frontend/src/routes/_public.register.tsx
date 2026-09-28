import { createFileRoute, redirect } from '@tanstack/react-router';
import Register from '@/features/auth/pages/Register';
import { hasCompletedOnboarding } from '@/features/onboarding/model/onboarding.store';

export const Route = createFileRoute('/_public/register')({
  beforeLoad: () => {
    if (!hasCompletedOnboarding()) throw redirect({ to: '/onboarding' });
  },
  component: Register,
});
