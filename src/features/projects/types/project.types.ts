/**
 * Project domain types.
 * Re-exported from the shared contract layer so existing component imports
 * continue to work without modification.
 */
export type {
  Project,
  ProjectMember,
  ProjectListResponse,
  ProjectMemberListResponse,
  ProjectMemberResponse,
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddProjectMemberRequest,
  ProjectsQueryParams,
  ProjectMembersQueryParams,
  ProjectSortBy,
  SortOrder,
} from '@/src/shared/types/api.types';

// ─── Legacy aliases kept for backward compatibility ───────────────────────────

import type { ProjectListResponse, User } from '@/src/shared/types/api.types';

/** @deprecated Use ProjectListResponse from @/src/shared/types/api.types */
export type ProjectsPaginatedResponse = ProjectListResponse;

/** @deprecated Use User from @/src/shared/types/api.types */
export type ProjectUser = Pick<User, 'id' | 'name' | 'email'> & { avatar?: string };

/** @deprecated Not in the backend contract. Use Project.status (string) */
export type ProjectStatus = string;

/** @deprecated Use UserRole from @/src/shared/types/api.types */
export type ProjectRole = 'ADMIN' | 'MEMBER';
