import { createFileRoute, redirect } from '@tanstack/react-router';
import Onboarding from '@/features/onboarding/pages/Onboarding';
import { hasCompletedOnboarding } from '@/features/onboarding/model/onboarding.store';

export const Route = createFileRoute('/_public/onboarding')({
  beforeLoad: () => {
    if (hasCompletedOnboarding()) throw redirect({ to: '/login' });
  },
  component: Onboarding,
});
