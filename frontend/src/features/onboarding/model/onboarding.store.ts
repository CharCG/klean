import { create } from 'zustand';
import { z } from 'zod';

const onboardingStatusSchema = z.enum(['pending', 'complete']);
type OnboardingStatus = z.infer<typeof onboardingStatusSchema>;

const STORAGE_KEY = 'klean_onboarding';

interface OnboardingState {
  status: OnboardingStatus;
  complete: () => void;
}

function readStatus(): OnboardingStatus {
  const result = onboardingStatusSchema.safeParse(localStorage.getItem(STORAGE_KEY));
  return result.success ? result.data : 'pending';
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  status: readStatus(),
  complete: () => {
    localStorage.setItem(STORAGE_KEY, 'complete');
    set({ status: 'complete' });
  },
}));

export function hasCompletedOnboarding(): boolean {
  return useOnboardingStore.getState().status === 'complete';
}
