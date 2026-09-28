import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginRequest } from '../api/auth.api';
import { authKeys, profileQueryOptions } from './auth.queries';
import { useSessionStore } from './session.store';
import type { AuthUser, Role } from '@/features/user/model/user.schemas';

export function useAuth() {
  const queryClient = useQueryClient();
  const token = useSessionStore((state) => state.token);
  const mode = useSessionStore((state) => state.mode);
  const setSession = useSessionStore((state) => state.setSession);
  const setMode = useSessionStore((state) => state.setMode);
  const clearSession = useSessionStore((state) => state.clearSession);

  const profileQuery = useQuery({
    ...profileQueryOptions(),
    enabled: Boolean(token),
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginRequest({ email, password }),
    onSuccess: async ({ token: nextToken, user }) => {
      setSession(nextToken, user.role);
      await queryClient.fetchQuery(profileQueryOptions());
    },
  });

  const logout = () => {
    clearSession();
    queryClient.removeQueries({ queryKey: authKeys.profile });
    window.location.assign('/login');
  };

  const updateUser = (data: Partial<AuthUser>) => {
    queryClient.setQueryData(authKeys.profile, (current: AuthUser | undefined) => (
      current ? { ...current, ...data } : current
    ));
  };

  return {
    user: profileQuery.data ?? null,
    token,
    mode,
    isLoading: Boolean(token) && profileQuery.isLoading,
    setMode: (nextMode: Role) => setMode(nextMode),
    login: (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
    logout,
    updateUser,
  };
}
