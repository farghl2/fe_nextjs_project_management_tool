'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi } from '../api/profile.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import { getApiErrorMessage } from '@/src/shared/types/api.types';
import type { UpdateUserRequest } from '@/src/shared/types/api.types';

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE.ME,
    queryFn: () => profileApi.getProfile(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useUpdateProfile(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      profileApi.updateProfile(userId || '', data),
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully');
      queryClient.setQueryData(QUERY_KEYS.PROFILE.ME, updatedUser);
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update profile'));
    },
  });
}
