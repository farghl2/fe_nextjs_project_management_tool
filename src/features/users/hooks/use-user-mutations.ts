'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import { getApiErrorMessage } from '@/src/shared/types/api.types';
import type {
  User,
  PaginatedResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
} from '@/src/shared/types/api.types';

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to create user'));
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_updatedUser, { id }) => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(id) });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update user'));
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: (_data, id) => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete user'));
    },
  });
}

// ─── Optimistic Status Toggle ─────────────────────────────────────────────────

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusRequest }) =>
      usersApi.updateUserStatus(id, data),

    onMutate: async ({ id, data }) => {
      // 1. Cancel any outgoing refetches for users list
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USERS.ALL });

      // 2. Snapshot current user list queries for potential rollback
      const previousQueries = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: QUERY_KEYS.USERS.ALL,
      });

      // 3. Optimistically update cached user list queries instantly
      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: QUERY_KEYS.USERS.ALL },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((u) => (u.id === id ? { ...u, isActive: data.isActive } : u)),
          };
        }
      );

      return { previousQueries };
    },

    onError: (err, _variables, context) => {
      // Roll back to snapshot context on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData);
        });
      }
      toast.error(getApiErrorMessage(err, 'Failed to update user status'));
    },

    onSuccess: (updatedUser) => {
      toast.success(
        updatedUser.isActive ? 'User activated successfully' : 'User deactivated successfully'
      );
    },

    onSettled: () => {
      // Re-sync with backend
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.ME });
    },
  });
}

// ─── Backward-compat aliases ──────────────────────────────────────────────────

/** @deprecated Use useCreateUserMutation */
export function useCreateUser() {
  return useCreateUserMutation();
}

/** @deprecated Use useUpdateUserMutation */
export function useUpdateUser(id: string) {
  const mutation = useUpdateUserMutation();
  return {
    ...mutation,
    mutate: (data: UpdateUserRequest) => mutation.mutate({ id, data }),
    mutateAsync: (data: UpdateUserRequest) => mutation.mutateAsync({ id, data }),
  };
}

/** @deprecated Use useDeleteUserMutation */
export function useDeleteUser() {
  return useDeleteUserMutation();
}
