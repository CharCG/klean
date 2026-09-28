import { createFileRoute, redirect } from '@tanstack/react-router';
import Login from '@/features/auth/pages/Login';
import { hasCompletedOnboarding } from '@/features/onboarding/model/onboarding.store';

export const Route = createFileRoute('/_public/login')({
  beforeLoad: () => {
    if (!hasCompletedOnboarding()) throw redirect({ to: '/onboarding' });
  },
  component: Login,
});
