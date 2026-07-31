'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from '@/src/i18n/routing';
import { authApi } from '../api/auth.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import { APP_ROUTES } from '@/src/shared/constans/routes';
import { getApiErrorMessage } from '@/src/shared/types/api.types';
import { useAuth } from '@/src/shared/providers/auth-context';
import type { LoginRequest } from '@/src/shared/types/api.types';

// ─── Query: current user ─────────────────────────────────────────────────────

export function useAuthMe() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: authApi.me,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

// ─── Mutation: login ─────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { refetchUser } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: async (user) => {
      // 1. Purge any stale queries from previous session
      queryClient.clear();
      // 2. Set fresh query data for the logged in user
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, user);
      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, user);
      // 3. Update AuthContext state
      await refetchUser();
      // 4. Navigate to dashboard
      router.push(APP_ROUTES.DASHBOARD);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    },
  });
}

// ─── Mutation: logout ────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast.success('Signed out successfully');
    },
    onSettled: () => {
      queryClient.clear();
      setUser(null);
      router.push(APP_ROUTES.LOGIN);
    },
  });
}

// ─── Mutation: refresh token ─────────────────────────────────────────────────

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });
}
