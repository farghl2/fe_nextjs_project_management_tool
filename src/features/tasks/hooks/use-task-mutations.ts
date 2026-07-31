'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tasksApi } from '../api/tasks.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import { getApiErrorMessage } from '@/src/shared/types/api.types';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskListResponse,
  Task,
} from '@/src/shared/types/api.types';

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApi.createTask(data),
    onSuccess: (_task, variables) => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(variables.projectId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.DETAIL(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to create task'));
    },
  });
}

// ─── Update (full edit) ───────────────────────────────────────────────────────

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (updatedTask, { id }) => {
      toast.success('Task updated successfully');
      // Patch the detail cache immediately
      queryClient.setQueryData(QUERY_KEYS.TASKS.DETAIL(id), updatedTask);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update task'));
    },
  });
}

// ─── Optimistic status update (Kanban drag & drop) ────────────────────────────

export function useUpdateTaskStatusMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: string; newStatus: string }) =>
      tasksApi.updateTask(taskId, { status: newStatus as UpdateTaskRequest['status'] }),

    onMutate: async ({ taskId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(projectId) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS.ALL });

      const previousProjectQueries = queryClient.getQueriesData<TaskListResponse>({
        queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(projectId),
      });
      const previousGlobalQueries = queryClient.getQueriesData<TaskListResponse>({
        queryKey: QUERY_KEYS.TASKS.ALL,
      });
      const previousTaskDetail = queryClient.getQueryData<Task>(QUERY_KEYS.TASKS.DETAIL(taskId));

      const applyOptimistic = (old: TaskListResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((t) =>
            t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t
          ),
        };
      };

      queryClient.setQueriesData<TaskListResponse>(
        { queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(projectId) },
        applyOptimistic
      );
      queryClient.setQueriesData<TaskListResponse>(
        { queryKey: QUERY_KEYS.TASKS.ALL },
        applyOptimistic
      );
      if (previousTaskDetail) {
        queryClient.setQueryData(QUERY_KEYS.TASKS.DETAIL(taskId), {
          ...previousTaskDetail,
          status: newStatus,
        });
      }

      return { previousProjectQueries, previousGlobalQueries, previousTaskDetail };
    },

    onSuccess: () => {
      toast.success('Task status updated');
    },

    onError: (err, { taskId }, context) => {
      if (context?.previousProjectQueries) {
        context.previousProjectQueries.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
      if (context?.previousGlobalQueries) {
        context.previousGlobalQueries.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        );
      }
      if (context?.previousTaskDetail) {
        queryClient.setQueryData(QUERY_KEYS.TASKS.DETAIL(taskId), context.previousTaskDetail);
      }
      toast.error(getApiErrorMessage(err, 'Failed to update task status'));
    },

    onSettled: (_data, _err, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.DETAIL(taskId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function useDeleteTaskMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: (_data, taskId) => {
      toast.success('Task deleted successfully');
      queryClient.removeQueries({ queryKey: QUERY_KEYS.TASKS.DETAIL(taskId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete task'));
    },
  });
}

// ─── Backward-compat aliases ──────────────────────────────────────────────────

/** @deprecated Use useCreateTaskMutation */
export function useCreateTask(projectId: string) {
  const mutation = useCreateTaskMutation();
  return {
    ...mutation,
    mutate: (data: Omit<CreateTaskRequest, 'projectId'>) =>
      mutation.mutate({ ...data, projectId }),
    mutateAsync: (data: Omit<CreateTaskRequest, 'projectId'>) =>
      mutation.mutateAsync({ ...data, projectId }),
  };
}

/** @deprecated Use useUpdateTaskMutation */
export function useUpdateTask(_projectId: string, taskId: string) {
  const mutation = useUpdateTaskMutation();
  return {
    ...mutation,
    mutate: (data: UpdateTaskRequest) => mutation.mutate({ id: taskId, data }),
    mutateAsync: (data: UpdateTaskRequest) => mutation.mutateAsync({ id: taskId, data }),
  };
}

/** @deprecated Use useUpdateTaskStatusMutation */
export function useUpdateTaskStatus(projectId: string) {
  return useUpdateTaskStatusMutation(projectId);
}

/** @deprecated Use useDeleteTaskMutation */
export function useDeleteTask(projectId: string) {
  return useDeleteTaskMutation(projectId);
}
