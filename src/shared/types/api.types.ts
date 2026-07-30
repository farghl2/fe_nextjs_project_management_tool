/* =========================================================
   Enums
========================================================= */

export type UserRole = 'ADMIN' | 'MEMBER';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SortOrder = 'asc' | 'desc';

export type UserSortBy = 'name' | 'createdAt' | 'updatedAt' | 'job';

export type ProjectSortBy = 'createdAt' | 'updatedAt' | 'name';

export type TaskSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'dueDate'
  | 'title'
  | 'priority'
  | 'status';

/* =========================================================
   Generic API Types
========================================================= */

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  /** Convenience shortcut — same as meta.totalPages */
  totalPages?: number;
  /** Convenience shortcut — same as meta.total */
  total?: number;
  /** Convenience shortcut — same as meta.page */
  page?: number;
  /** Convenience shortcut — same as meta.limit */
  limit?: number;
}

/* =========================================================
   Auth
========================================================= */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  /** Alias for `image` used by some components */
  avatar?: string | null;
  description?: string | null;
  job?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: AuthUser;
}

/* =========================================================
   Profile
========================================================= */

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  image?: string;
  description?: string;
  job?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/* =========================================================
   User
========================================================= */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  /** Profile image URL as returned by the backend */
  image?: string | null;
  /**
   * Alias for `image` — some backend responses and older components use `avatar`.
   * Prefer `image` for new code.
   */
  avatar?: string | null;
  description?: string | null;
  job?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  description?: string;
  job?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  image?: string;
  description?: string;
  job?: string;
  role?: UserRole;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

/* =========================================================
   User Query Params
========================================================= */

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: UserSortBy;
  sortOrder?: SortOrder;
}

/* =========================================================
   User Responses
========================================================= */

export type UserResponse = ApiResponse<User>;
export type UserListResponse = PaginatedResponse<User>;

/* =========================================================
   Project Members (defined before Project so Project can reference it)
========================================================= */

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  user: User;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   Project
========================================================= */

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  membersCount?: number;
  tasksCount?: number;
  /** Populated when the backend includes member objects in the response */
  members?: ProjectMember[];
  /**
   * Prisma _count shape — backend may return { _count: { members: N, tasks: N } }
   * The API layer normalises this into membersCount / tasksCount.
   */
  _count?: { members?: number; tasks?: number };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

/* =========================================================
   Project Query Params
========================================================= */

export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  memberId?: string;
  sortBy?: ProjectSortBy;
  sortOrder?: SortOrder;
}

/* =========================================================
   Project Responses
========================================================= */

export type ProjectResponse = ApiResponse<Project>;
export type ProjectListResponse = PaginatedResponse<Project>;

export interface AddProjectMemberRequest {
  userId: string;
}

export interface ProjectMembersQueryParams {
  page?: number;
  limit?: number;
}

export type ProjectMemberResponse = ApiResponse<ProjectMember>;
export type ProjectMemberListResponse = PaginatedResponse<ProjectMember>;

/* =========================================================
   Task
========================================================= */

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
  assignee?: User | null;
  createdById?: string;
  creator?: User | null;
  createdAt?: string;
  updatedAt?: string;
  /**
   * Populated by the dashboard endpoint for recent-tasks display.
   * Not present on standard task detail/list responses.
   */
  projectName?: string | null;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
}

/* =========================================================
   Global Task Query Params
========================================================= */

export interface GlobalTasksQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  search?: string;
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
}

/* =========================================================
   Project Task Query Params
========================================================= */

export interface ProjectTasksQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  search?: string;
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
}

/* =========================================================
   Task Responses
========================================================= */

export type TaskResponse = ApiResponse<Task>;
export type TaskListResponse = PaginatedResponse<Task>;

/* =========================================================
   Dashboard
========================================================= */

/**
 * Stats block — field presence depends on role:
 * ADMIN: all fields present
 * MEMBER: myProjects / myTasks instead of totals
 */
export interface DashboardStats {
  totalProjects?: number;
  totalUsers?: number;
  totalTasks?: number;
  inProgressTasks?: number;
  completedTasks?: number;
  myProjects?: number;
  myTasks?: number;
}

/**
 * Confirmed from real backend response (2026-07-30):
 * recentProjects: id, name, description, createdAt, updatedAt  (no status)
 * recentTasks: id, title, status, priority, dueDate, projectId, assigneeId, createdAt (no assignee object)
 */
export interface DashboardData {
  role: UserRole;
  stats: DashboardStats;
  recentProjects?: Array<{
    id: string;
    name: string;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }>;
  recentTasks?: Array<{
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    projectId: string;
    assigneeId?: string | null;
    createdAt?: string;
  }>;
  upcomingTasks?: Task[];
}

export type DashboardResponse = ApiResponse<DashboardData>;

/* =========================================================
   Error parsing utility
========================================================= */

/**
 * Extracts a human-readable error message from any caught value.
 * Use at mutation onError / catch boundaries.
 */
export function getApiErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  const axiosErr = err as { response?: { data?: ApiError }; message?: string };
  return axiosErr?.response?.data?.message ?? axiosErr?.message ?? fallback;
}

/**
 * Extracts per-field validation errors from any caught value.
 * Returns an empty object when none are present.
 */
export function getApiFieldErrors(err: unknown): Record<string, string[]> {
  const axiosErr = err as { response?: { data?: ApiError } };
  return axiosErr?.response?.data?.errors ?? {};
}
