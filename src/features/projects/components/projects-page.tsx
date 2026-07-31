'use client';

import React, { useState } from 'react';
import { useProjects } from '../hooks/use-projects';
import { useProjectParams } from '../hooks/use-project-params';
import { ProjectToolbar } from './project-toolbar';
import { ProjectGrid } from './project-grid';
import { ProjectCardSkeleton } from './project-card-skeleton';
import { CreateProjectDialog } from './create-project-dialog';
import { EditProjectDialog } from './edit-project-dialog';
import { DeleteProjectDialog } from './delete-project-dialog';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { Pagination } from '@/src/shared/components/pagination';
import { Project } from '../types/project.types';
import { FolderKanban } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProjectsPage() {
  const t = useTranslations('projects');
  const { queryParams, setPage, setLimit } = useProjectParams();
  const { data: response, isLoading, isError, refetch } = useProjects(queryParams);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const projects = response?.data || [];
  const currentLimit = queryParams.limit || 12;

  // Safe total pages calculation
  const totalPages =
    response?.totalPages ??
    response?.meta?.totalPages ??
    (response?.meta?.total || response?.total
      ? Math.ceil((response.meta?.total || response.total || 0) / currentLimit)
      : 1);

  const currentPage = queryParams.page || 1;
  const totalItems = response?.total ?? response?.meta?.total;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ProjectToolbar onNewProject={() => setCreateOpen(true)} />

      {/* Loading Skeleton */}
      {isLoading && <ProjectCardSkeleton count={6} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title={t('load_error_title')}
          message={t('load_error_desc')}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title={t('no_projects_title')}
          description={t('no_projects_desc')}
          actionLabel={t('create_first_project')}
          onAction={() => setCreateOpen(true)}
        />
      )}

      {/* Project Grid & Pagination */}
      {!isLoading && !isError && projects.length > 0 && (
        <>
          <ProjectGrid
            projects={projects}
            onEdit={(p) => setEditingProject(p)}
            onDelete={(p) => setDeletingProject(p)}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={currentLimit}
            limitOptions={[6, 12, 24, 48]}
            totalItems={totalItems}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </>
      )}

      {/* Dialogs */}
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditProjectDialog
        project={editingProject}
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      />
      <DeleteProjectDialog
        project={deletingProject}
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
      />
    </div>
  );
}
