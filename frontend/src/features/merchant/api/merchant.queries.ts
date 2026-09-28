export const merchantKeys = {
  all: ['merchant'] as const,
  lists: () => [...merchantKeys.all, 'list'] as const,
  list: () => [...merchantKeys.lists()] as const,
  details: () => [...merchantKeys.all, 'detail'] as const,
  detail: (id: string | undefined) => [...merchantKeys.details(), id] as const,
  profile: () => [...merchantKeys.all, 'profile'] as const,
  dashboard: () => [...merchantKeys.all, 'dashboard'] as const,
};
