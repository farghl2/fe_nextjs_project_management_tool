'use client';

import React from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { AppShell } from '@/src/shared/components/layout/app-shell';
import { PageContainer } from '@/src/shared/components/layout/page-container';
import { PageHeader } from '@/src/shared/components/page-header';
import { TaskWorkspace } from '@/src/features/tasks';
import { useProjects } from '@/src/features/projects';
import { Skeleton } from '@/src/shared/components/ui/skeleton';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { ListTodo } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TasksRoutePage() {
  const t = useTranslations('tasks');
  const tNav = useTranslations('navigation');
  const tProj = useTranslations('projects');

  const { data: projectsData, isLoading: projectsLoading, isError, refetch } = useProjects({ limit: 50 });
  const projects = projectsData?.data || [];

  const [selectedProjectId, setSelectedProjectId] = useQueryState(
    'projectId',
    parseAsString.withOptions({ shallow: true })
  );

  // Use URL state if set, otherwise fall back to the first project once loaded
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const projectSelectorAction = projects.length > 0 ? (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
        {tProj('name_label')}:
      </span>
      <Select
        value={activeProjectId}
        onValueChange={(val) => setSelectedProjectId(val)}
      >
        <SelectTrigger className="h-9 text-xs w-full sm:w-[220px] bg-card">
          <SelectValue placeholder={t('select_project')} />
        </SelectTrigger>
        <SelectContent align="start" className="max-w-[280px]">
          {projects.map((proj) => (
            <SelectItem key={proj.id} value={proj.id}>
              {proj.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : undefined;

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={t('page_title')}
          description={t('page_desc_global')}
          breadcrumbs={[
            { label: tNav('home'), href: '/dashboard' },
            { label: tNav('tasks') },
          ]}
          actions={projectSelectorAction}
        />

        {projectsLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        )}

        {isError && (
          <ErrorState
            title={tProj('load_error_title')}
            message={tProj('load_error_desc')}
            onRetry={refetch}
          />
        )}

        {!projectsLoading && !isError && projects.length === 0 && (
          <EmptyState
            icon={ListTodo}
            title={tProj('no_projects_title')}
            description={tProj('no_projects_desc')}
          />
        )}

        {!projectsLoading && !isError && activeProjectId && (
          <TaskWorkspace projectId={activeProjectId} />
        )}
      </PageContainer>
    </AppShell>
  );
}
