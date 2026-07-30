'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '../api/projects.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import { getApiErrorMessage } from '@/src/shared/types/api.types';
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  AddProjectMemberRequest,
} from '@/src/shared/types/api.types';

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.createProject(data),
    onSuccess: () => {
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to create project'));
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (updatedProject, { id }) => {
      toast.success('Project updated successfully');
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.DETAIL(id), updatedProject);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update project'));
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: (_data, id) => {
      toast.success('Project deleted successfully');
      queryClient.removeQueries({ queryKey: QUERY_KEYS.PROJECTS.DETAIL(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
      queryClient.removeQueries({ queryKey: ['tasks', 'project', id] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete project'));
    },
  });
}

// ─── Add member ───────────────────────────────────────────────────────────────

export function useAddProjectMemberMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddProjectMemberRequest) =>
      projectsApi.addProjectMember(projectId, data),
    onSuccess: () => {
      toast.success('Member added successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.MEMBERS(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId) });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to add member'));
    },
  });
}

// ─── Remove member ────────────────────────────────────────────────────────────

export function useRemoveProjectMemberMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => projectsApi.removeProjectMember(projectId, userId),
    onSuccess: () => {
      toast.success('Member removed successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.MEMBERS(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId) });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to remove member'));
    },
  });
}

// ─── Backward-compat aliases ──────────────────────────────────────────────────

/** @deprecated Use useCreateProjectMutation */
export function useCreateProject() {
  return useCreateProjectMutation();
}

/** @deprecated Use useUpdateProjectMutation */
export function useUpdateProject(projectId: string) {
  const mutation = useUpdateProjectMutation();
  return {
    ...mutation,
    mutate: (data: UpdateProjectRequest) => mutation.mutate({ id: projectId, data }),
    mutateAsync: (data: UpdateProjectRequest) => mutation.mutateAsync({ id: projectId, data }),
  };
}

/** @deprecated Use useDeleteProjectMutation */
export function useDeleteProject() {
  return useDeleteProjectMutation();
}

/** @deprecated Use useAddProjectMemberMutation */
export function useAddProjectMember(projectId: string) {
  return useAddProjectMemberMutation(projectId);
}

/** @deprecated Use useRemoveProjectMemberMutation */
export function useRemoveProjectMember(projectId: string) {
  return useRemoveProjectMemberMutation(projectId);
}
