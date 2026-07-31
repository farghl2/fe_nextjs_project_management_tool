'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import type { ProjectsQueryParams } from '@/src/shared/types/api.types';

/** GET /projects — paginated, filterable */
export function useProjectsQuery(params?: ProjectsQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.LIST(params),
    queryFn: () => projectsApi.getProjects(params),
    staleTime: 1000 * 60 * 3,
  });
}

/** GET /projects/:id */
export function useProjectQuery(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
    queryFn: () => projectsApi.getProjectById(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 3,
  });
}

// ─── Backward-compat aliases ──────────────────────────────────────────────────
/** @deprecated Use useProjectsQuery */
export const useProjects = useProjectsQuery;
/** @deprecated Use useProjectQuery */
export const useProject = useProjectQuery;
