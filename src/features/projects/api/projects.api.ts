import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import { normalisePaginatedResponse } from '@/src/shared/lib/normalise-paginated-response';
import type {
  Project,
  ProjectListResponse,
  ProjectMember,
  ProjectMemberListResponse,
  ProjectsQueryParams,
  ProjectMembersQueryParams,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddProjectMemberRequest,
} from '@/src/shared/types/api.types';

function normaliseProject(p: Project): Project {
  return {
    ...p,
    membersCount: p.membersCount ?? p._count?.members ?? p.members?.length,
    tasksCount: p.tasksCount ?? p._count?.tasks,
  };
}

type RawMember = ProjectMember & {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  User?: { id: string; name?: string; email?: string; image?: string; avatar?: string };
};

function normaliseMember(raw: RawMember): ProjectMember {
  const inlineUser = raw.User ?? null;
  const user = raw.user ?? inlineUser;
  const resolvedUserId = raw.userId || user?.id || raw.id || '';

  return {
    ...raw,
    userId: resolvedUserId,
    user: user
      ? {
          ...user,
          name: user.name || raw.userName || '',
          email: user.email || raw.userEmail || '',
          image: user.image || raw.userImage || null,
          id: user.id || resolvedUserId,
          role: (user as { role?: string }).role as 'ADMIN' | 'MEMBER' ?? 'MEMBER',
          isActive: (user as { isActive?: boolean }).isActive ?? true,
        }
      : {
          id: resolvedUserId,
          name: raw.userName || '',
          email: raw.userEmail || '',
          image: raw.userImage || null,
          role: 'MEMBER' as const,
          isActive: true,
        },
  };
}

export const projectsApi = {
  /** GET /projects */
  getProjects: async (params?: ProjectsQueryParams): Promise<ProjectListResponse> => {
    const response = await api.get<unknown>(
      API_ENDPOINTS.PROJECTS.BASE,
      params as Record<string, unknown>
    );
    return normalisePaginatedResponse<Project>(response, params, 12, normaliseProject);
  },

  /** GET /projects/:id */
  getProjectById: async (id: string): Promise<Project> => {
    const project = await api.get<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return normaliseProject(project);
  },

  /** POST /projects */
  createProject: (data: CreateProjectRequest): Promise<Project> =>
    api.post<Project>(API_ENDPOINTS.PROJECTS.BASE, data),

  /** PATCH /projects/:id */
  updateProject: (id: string, data: UpdateProjectRequest): Promise<Project> =>
    api.patch<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id), data),

  /** DELETE /projects/:id */
  deleteProject: (id: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.PROJECTS.BY_ID(id)),

  // ─── Members ───────────────────────────────────────────────────────────────

  /** GET /projects/:id/members */
  getProjectMembers: async (
    projectId: string,
    params?: ProjectMembersQueryParams
  ): Promise<ProjectMemberListResponse> => {
    const response = await api.get<unknown>(
      API_ENDPOINTS.PROJECTS.MEMBERS(projectId),
      params as Record<string, unknown>
    );
    return normalisePaginatedResponse<ProjectMember>(response, params, 50, normaliseMember);
  },

  /** POST /projects/:id/members */
  addProjectMember: (
    projectId: string,
    data: AddProjectMemberRequest
  ): Promise<ProjectMember> =>
    api.post<ProjectMember>(API_ENDPOINTS.PROJECTS.MEMBERS(projectId), data),

  /** DELETE /projects/:id/members/:userId */
  removeProjectMember: (projectId: string, userId: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.PROJECTS.MEMBER(projectId, userId)),
};
