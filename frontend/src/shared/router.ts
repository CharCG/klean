import {
  Link,
  useLocation as useTanStackLocation,
  useNavigate as useTanStackNavigate,
  useRouter,
  useRouterState,
  type ParsedLocation,
} from '@tanstack/react-router';
import { useCallback } from 'react';

interface NavigateOptions {
  replace?: boolean;
  state?: Record<string, unknown>;
}

type NavigateTarget = string | number;

export { Link };

export function useNavigate() {
  const navigate = useTanStackNavigate();
  const router = useRouter();

  return useCallback((target: NavigateTarget, options?: NavigateOptions) => {
    if (typeof target === 'number') {
      router.history.go(target);
      return;
    }

    void navigate({
      to: target,
      replace: options?.replace,
      state: options?.state,
    });
  }, [navigate, router]);
}

export function useLocation(): ParsedLocation {
  return useTanStackLocation();
}

export function useParams<TParams extends Record<string, string>>(): TParams {
  const params = useRouterState({
    select: (state) => state.matches.at(-1)?.params,
  });
  return (params ?? {}) as unknown as TParams;
}

export function useSearchParams(): readonly [URLSearchParams] {
  const location = useTanStackLocation();
  const searchParams = new URLSearchParams(location.href.split('?')[1] ?? '');
  return [searchParams] as const;
}
