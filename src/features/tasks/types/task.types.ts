/**
 * Task domain types.
 * Re-exported from the shared contract layer so existing component imports
 * continue to work without modification.
 */
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskSortBy,
  TaskListResponse,
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  GlobalTasksQueryParams,
  ProjectTasksQueryParams,
  SortOrder,
} from '@/src/shared/types/api.types';

// ─── Legacy aliases kept for backward compatibility ───────────────────────────

/** @deprecated Use GlobalTasksQueryParams or ProjectTasksQueryParams from shared types */
export type TasksQueryParams = import('@/src/shared/types/api.types').GlobalTasksQueryParams;

/** @deprecated Use TaskListResponse from @/src/shared/types/api.types */
export type TasksPaginatedResponse = import('@/src/shared/types/api.types').TaskListResponse;

/** @deprecated Use User from @/src/shared/types/api.types */
export type TaskAssignee = import('@/src/shared/types/api.types').User;

/** @deprecated Use User from @/src/shared/types/api.types */
export type TaskCreator = import('@/src/shared/types/api.types').User;
