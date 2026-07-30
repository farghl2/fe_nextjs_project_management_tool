'use client';

import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import type { GlobalTasksQueryParams, ProjectTasksQueryParams } from '@/src/shared/types/api.types';

/** GET /tasks — global task list (all projects) */
export function useGlobalTasksQuery(params?: GlobalTasksQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS.GLOBAL_LIST(params),
    queryFn: () => tasksApi.getGlobalTasks(params),
    staleTime: 1000 * 60 * 3,
  });
}

/** GET /tasks/project/:projectId — tasks scoped to one project */
export function useProjectTasksQuery(projectId: string, params?: ProjectTasksQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS.PROJECT_LIST(projectId, params),
    queryFn: () => tasksApi.getProjectTasks(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 3,
  });
}

/** GET /tasks/:id */
export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS.DETAIL(id),
    queryFn: () => tasksApi.getTaskById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });
}

// ─── Backward-compat aliases ──────────────────────────────────────────────────
/** @deprecated Use useProjectTasksQuery */
export const useProjectTasks = useProjectTasksQuery;
/** @deprecated Use useTaskQuery */
export const useTask = useTaskQuery;
