'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api/projects.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import type { ProjectMembersQueryParams } from '@/src/shared/types/api.types';

/** GET /projects/:id/members */
export function useProjectMembersQuery(
  projectId: string,
  params?: ProjectMembersQueryParams
) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.MEMBERS(projectId, params),
    queryFn: () => projectsApi.getProjectMembers(projectId, params),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 3,
  });
}

// ─── Backward-compat alias ────────────────────────────────────────────────────
/**
 * @deprecated Use useProjectMembersQuery (returns ProjectMemberListResponse with .data[])
 * This alias returns the flat member array for backward compatibility with existing components.
 */
export function useProjectMembers(projectId: string) {
  const query = useProjectMembersQuery(projectId);
  return {
    ...query,
    data: query.data?.data ?? (query.data === undefined ? undefined : []),
  };
}
