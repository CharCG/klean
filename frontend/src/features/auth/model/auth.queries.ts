import { queryOptions } from '@tanstack/react-query';
import { getProfile, userKeys } from '@/features/user/api/user.api';

export const authKeys = {
  profile: userKeys.profile,
};

export const profileQueryOptions = () => queryOptions({
  queryKey: authKeys.profile,
  queryFn: getProfile,
  retry: false,
  staleTime: 30_000,
});
