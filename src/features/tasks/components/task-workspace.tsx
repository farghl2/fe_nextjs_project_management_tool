'use client';

import React, { useState } from 'react';
import { useProjectTasks } from '../hooks/use-tasks';
import { useProjectMembers } from '@/src/features/projects/hooks/use-project-members';
import { useTaskParams } from '../hooks/use-task-params';
import { TaskToolbar } from './task-toolbar';
import { TaskBoard } from './task-board';
import { TaskTable } from './task-table';
import { TaskBoardSkeleton } from './task-board-skeleton';
import { TaskTableSkeleton } from './task-table-skeleton';
import { TaskDetailsDrawer } from './task-details-drawer';
import { CreateTaskDialog } from './create-task-dialog';
import { EditTaskDialog } from './edit-task-dialog';
import { DeleteTaskDialog } from './delete-task-dialog';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { Pagination } from '@/src/shared/components/pagination';
import { Task } from '../types/task.types';
import { ListTodo } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/src/shared/providers/auth-context';

interface TaskWorkspaceProps {
  projectId: string;
}

export function TaskWorkspace({ projectId }: TaskWorkspaceProps) {
  const t = useTranslations('tasks');
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const { view, queryParams, setPage, setLimit } = useTaskParams();
  const { data: response, isLoading, isError, refetch } = useProjectTasks(projectId, queryParams);
  const { data: members = [] } = useProjectMembers(projectId);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const tasks = response?.data || [];
  const currentLimit = queryParams.limit || 10;

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
      {/* Toolbar — Organized 2-section layout */}
      <TaskToolbar projectId={projectId} onNewTask={() => setCreateOpen(true)} />

      {/* Loading Skeletons */}
      {isLoading && (view === 'board' ? <TaskBoardSkeleton /> : <TaskTableSkeleton count={5} />)}

      {/* Error State */}
      {isError && (
        <ErrorState
          title={t('load_error_title')}
          message={t('load_error_desc')}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && tasks.length === 0 && (
        <EmptyState
          icon={ListTodo}
          title={t('no_tasks_title')}
          description={t('no_tasks_desc')}
          actionLabel={isAdmin ? t('create_first_task') : undefined}
          onAction={isAdmin ? () => setCreateOpen(true) : undefined}
        />
      )}

      {/* Main Content View (Board vs List) & Universal Pagination */}
      {!isLoading && !isError && tasks.length > 0 && (
        <>
          {view === 'board' ? (
            <TaskBoard
              projectId={projectId}
              tasks={tasks}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          ) : (
            <TaskTable
              tasks={tasks}
              members={members}
              onTaskClick={(task) => setSelectedTask(task)}
              onEdit={(task) => setEditingTask(task)}
              onDelete={(task) => setDeletingTask(task)}
            />
          )}

          {/* Universal Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={currentLimit}
            limitOptions={[5, 10, 20, 50, 100]}
            totalItems={totalItems}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </>
      )}

      {/* Task Drawer & Dialogs */}
      <TaskDetailsDrawer
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onEdit={(task) => setEditingTask(task)}
        onDelete={(task) => setDeletingTask(task)}
      />

      <CreateTaskDialog
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
      <EditTaskDialog
        projectId={projectId}
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      />
      <DeleteTaskDialog
        projectId={projectId}
        task={deletingTask}
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
      />
    </div>
  );
}
