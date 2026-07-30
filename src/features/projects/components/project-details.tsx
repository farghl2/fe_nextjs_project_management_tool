'use client';

import React, { useState } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { useProject } from '../hooks/use-projects';
import { ProjectHeader } from './project-header';
import { ProjectMembers } from './project-members';
import { ProjectDetailsSkeleton } from './project-details-skeleton';
import { EditProjectDialog } from './edit-project-dialog';
import { DeleteProjectDialog } from './delete-project-dialog';
import { AddMemberDialog } from './add-member-dialog';
import { TaskWorkspace } from '@/src/features/tasks';
import { ErrorState } from '@/src/shared/components/error-state';
import { NotFoundState } from '@/src/shared/components/not-found-state';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/shared/components/ui/tabs';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { FolderKanban, Users, ListTodo } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/src/i18n/routing';

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const t = useTranslations('projects');
  const router = useRouter();

  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsString.withDefault('overview').withOptions({ shallow: true })
  );

  const { data: project, isLoading, isError, refetch } = useProject(projectId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  if (isLoading) return <ProjectDetailsSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title={t('load_project_error_title')}
        message={t('load_project_error_desc')}
        onRetry={refetch}
      />
    );
  }

  if (!project) {
    return (
      <NotFoundState
        title={t('project_not_found_title')}
        description={t('project_not_found_desc')}
        primaryAction={{
          label: t('back_to_projects'),
          onClick: () => router.push('/projects'),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <ProjectHeader
        project={project}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
        onAddMember={() => setAddMemberOpen(true)}
      />

      {/* Detail Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card border border-border/80 p-1">
          <TabsTrigger value="overview" className="gap-2 text-xs font-medium">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>{t('tab_overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2 text-xs font-medium">
            <Users className="h-3.5 w-3.5" />
            <span>{t('tab_members')}</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2 text-xs font-medium">
            <ListTodo className="h-3.5 w-3.5" />
            <span>{t('tab_tasks')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="pt-4">
          <Card className="border-border/80">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-foreground">{t('project_about')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description || t('no_description')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Members */}
        <TabsContent value="members" className="pt-4">
          <ProjectMembers projectId={projectId} onAddMember={() => setAddMemberOpen(true)} />
        </TabsContent>

        {/* Tab 3: Tasks Workspace */}
        <TabsContent value="tasks" className="pt-4">
          <TaskWorkspace projectId={projectId} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditProjectDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteProjectDialog
        project={project}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <AddMemberDialog
        projectId={projectId}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
      />
    </div>
  );
}
