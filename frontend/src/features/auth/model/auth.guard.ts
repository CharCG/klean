import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { profileQueryOptions } from './auth.queries';
import { useSessionStore } from './session.store';
import type { Role } from '@/features/user/model/user.schemas';

const homeByRole: Record<Role, string> = {
  CUSTOMER: '/',
  MERCHANT: '/merchant',
  ADMIN: '/admin',
};

export async function getAuthenticatedUser(queryClient: QueryClient) {
  const { token, clearSession } = useSessionStore.getState();
  if (!token) throw redirect({ to: '/login' });

  try {
    return await queryClient.ensureQueryData(profileQueryOptions());
  } catch {
    clearSession();
    throw redirect({ to: '/login' });
  }
}

export async function requireRole(queryClient: QueryClient, allowedRoles: Role[]) {
  const user = await getAuthenticatedUser(queryClient);
  const merchantUsingCustomerMode = user.role === 'MERCHANT' && allowedRoles.includes('CUSTOMER');
  if (!allowedRoles.includes(user.role) && !merchantUsingCustomerMode) {
    throw redirect({ to: homeByRole[user.role] });
  }
  return user;
}

export async function redirectAuthenticatedUser(queryClient: QueryClient) {
  const { token, mode, clearSession } = useSessionStore.getState();
  if (!token) return;

  let user;
  try {
    user = await queryClient.ensureQueryData(profileQueryOptions());
  } catch {
    clearSession();
    return;
  }

  throw redirect({ to: homeByRole[mode ?? user.role] });
}
