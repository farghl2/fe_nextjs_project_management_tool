'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types/task.types';
import { TaskCard } from './task-card';
import { Badge } from '@/src/shared/components/ui/badge';
import { Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslations } from 'next-intl';
import type { ProjectMember } from '@/src/shared/types/api.types';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  members?: ProjectMember[];
}

const statusConfig: Record<
  TaskStatus,
  { icon: React.ElementType; colorClass: string; bgClass: string; badgeClass: string }
> = {
  TODO: {
    icon: Circle,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted/30 border-border/80',
    badgeClass: 'bg-muted text-muted-foreground',
  },
  IN_PROGRESS: {
    icon: Clock,
    colorClass: 'text-info',
    bgClass: 'bg-info/5 border-info/20',
    badgeClass: 'bg-info/10 text-info border-info/30',
  },
  IN_REVIEW: {
    icon: AlertCircle,
    colorClass: 'text-warning',
    bgClass: 'bg-warning/5 border-warning/20',
    badgeClass: 'bg-warning/10 text-warning border-warning/30',
  },
  DONE: {
    icon: CheckCircle2,
    colorClass: 'text-success',
    bgClass: 'bg-success/5 border-success/20',
    badgeClass: 'bg-success/10 text-success border-success/30',
  },
};

export function TaskColumn({ status, title, tasks, onTaskClick, members = [] }: TaskColumnProps) {
  const t = useTranslations('tasks');
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = statusConfig[status] || statusConfig.TODO;
  const Icon = config.icon;

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-2xl border p-3 min-h-[500px] transition-colors duration-200',
        config.bgClass,
        isOver && 'border-primary ring-2 ring-primary/20 bg-primary/5'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', config.colorClass)} />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{title}</h3>
        </div>
        <Badge variant="outline" className={cn('text-[10px] font-mono px-2 py-0', config.badgeClass)}>
          {tasks.length}
        </Badge>
      </div>

      {/* Droppable Task List */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-muted-foreground/60 italic border border-dashed border-border/50 rounded-xl">
              {t('empty_column')}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} members={members} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
