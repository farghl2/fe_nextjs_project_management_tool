'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/auth.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import type { UpdateProfileRequest, ChangePasswordRequest } from '@/src/shared/types/api.types';

// ─── Query: current user profile ─────────────────────────────────────────────

/**
 * Fetches the full profile of the current user via GET /users/me.
 * Includes extended fields (phone, image, description, job) that
 * GET /auth/me may omit depending on the backend.
 */
export function useProfileQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE.ME,
    queryFn: profileApi.getProfile,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

// ─── Mutation: update profile ─────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Keep auth/me and profile in sync
      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, updatedUser);
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updatedUser);
    },
  });
}

// ─── Mutation: change password ────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileApi.changePassword(data),
    // No cache update needed — password change doesn't alter user shape.
    // If the backend invalidates all sessions on password change, the next
    // request will 401 and the axios interceptor will redirect to login.
  });
}
