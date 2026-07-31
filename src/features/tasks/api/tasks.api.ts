import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import { normalisePaginatedResponse } from '@/src/shared/lib/normalise-paginated-response';
import type {
  Task,
  TaskListResponse,
  GlobalTasksQueryParams,
  ProjectTasksQueryParams,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@/src/shared/types/api.types';

// ─── Payload sanitisers ───────────────────────────────────────────────────────

function sanitiseCreatePayload(data: CreateTaskRequest): CreateTaskRequest {
  return {
    ...data,
    assigneeId: data.assigneeId?.trim() || undefined,
    dueDate: data.dueDate?.trim() || undefined,
    description: data.description?.trim() || undefined,
  };
}

function sanitiseUpdatePayload(data: UpdateTaskRequest): UpdateTaskRequest {
  const cleaned: UpdateTaskRequest = { ...data };
  if ('assigneeId' in cleaned) {
    cleaned.assigneeId = cleaned.assigneeId?.trim() || undefined;
  }
  if ('dueDate' in cleaned) {
    cleaned.dueDate = cleaned.dueDate?.trim() || undefined;
  }
  if ('description' in cleaned) {
    cleaned.description = cleaned.description?.trim() || undefined;
  }
  return cleaned;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const tasksApi = {
  /**
   * GET /tasks — global task list across all projects.
   */
  getGlobalTasks: async (params?: GlobalTasksQueryParams): Promise<TaskListResponse> => {
    const response = await api.get<unknown>(
      API_ENDPOINTS.TASKS.BASE,
      params as Record<string, unknown>
    );
    return normalisePaginatedResponse<Task>(response, params, 10);
  },

  /**
   * GET /tasks/project/:projectId — tasks scoped to a single project.
   */
  getProjectTasks: async (
    projectId: string,
    params?: ProjectTasksQueryParams
  ): Promise<TaskListResponse> => {
    const response = await api.get<unknown>(
      API_ENDPOINTS.TASKS.BY_PROJECT(projectId),
      params as Record<string, unknown>
    );
    return normalisePaginatedResponse<Task>(response, params, 10);
  },

  /** GET /tasks/:id */
  getTaskById: (id: string): Promise<Task> =>
    api.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id)),

  /** POST /tasks */
  createTask: (data: CreateTaskRequest): Promise<Task> =>
    api.post<Task>(API_ENDPOINTS.TASKS.BASE, sanitiseCreatePayload(data)),

  /** PATCH /tasks/:id */
  updateTask: (id: string, data: UpdateTaskRequest): Promise<Task> =>
    api.patch<Task>(API_ENDPOINTS.TASKS.BY_ID(id), sanitiseUpdatePayload(data)),

  /** DELETE /tasks/:id */
  deleteTask: (id: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.TASKS.BY_ID(id)),
};
