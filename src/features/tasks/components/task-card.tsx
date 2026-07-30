'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/task.types';
import { ProjectMember, User } from '@/src/shared/types/api.types';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { PriorityBadge } from '@/src/shared/components/priority-badge';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { GripVertical, CalendarDays } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTranslations } from 'next-intl';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  isOverlay?: boolean;
  /** Pass project members so we can resolve assignee name when task.assignee is null */
  members?: ProjectMember[];
}

export function resolveTaskAssignee(
  task: Task,
  members: ProjectMember[] = []
): { name: string; avatar?: string | null } | null {
  // 1. Direct assignee or nested user object on task
  const taskUser =
    task.assignee ||
    (task as any).assignedUser ||
    (task as any).user ||
    (task as any).assignedTo ||
    (task as any).member?.user ||
    (task as any).member;

  if (taskUser && (taskUser.name || taskUser.email)) {
    return {
      name: taskUser.name || taskUser.email || '',
      avatar: taskUser.avatar ?? taskUser.image ?? (taskUser as any).avatarUrl ?? null,
    };
  }

  // 2. Direct name properties on task
  if ((task as any).assigneeName || (task as any).userName) {
    return {
      name: (task as any).assigneeName || (task as any).userName,
      avatar: (task as any).assigneeImage || (task as any).userImage || null,
    };
  }

  // 3. Look up member in project members list by assigneeId
  const targetId = task.assigneeId || (taskUser as { id?: string })?.id;
  if (!targetId) return null;

  const found = members.find(
    (m) =>
      m.userId === targetId ||
      m.user?.id === targetId ||
      m.id === targetId
  );

  if (!found) return null;

  const name =
    found.user?.name ||
    found.user?.email ||
    (found as { userName?: string }).userName ||
    (found as { userEmail?: string }).userEmail;

  if (!name) return null;

  return {
    name,
    avatar: found.user?.avatar ?? found.user?.image ?? (found as { userImage?: string }).userImage ?? null,
  };
}

export function TaskCard({ task, onClick, isOverlay = false, members = [] }: TaskCardProps) {
  const t = useTranslations('tasks');
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const resolvedAssignee = resolveTaskAssignee(task, members);

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      className={cn('touch-none select-none', isOverlay && 'scale-105 shadow-xl z-50 cursor-grabbing')}
    >
      <Card
        onClick={() => onClick?.(task)}
        className={cn(
          'relative transition-all duration-200 border-border/80 hover:border-primary/40 bg-card hover:shadow-xs group cursor-pointer overflow-hidden',
          isDragging && 'border-primary/60 bg-muted/20'
        )}
      >
        <CardContent className="p-3.5 space-y-3">
          {/* Header: Drag Handle & Priority */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {!isOverlay && (
                <button
                  type="button"
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 text-muted-foreground/60 hover:text-foreground cursor-grab active:cursor-grabbing rounded-md transition-colors"
                  title="Drag to move task"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
              )}
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {/* Title & Description Preview */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Footer: Assignee Avatar & Due Date Badge */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {resolvedAssignee ? (
                <>
                  <UserAvatar
                    name={resolvedAssignee.name}
                    image={resolvedAssignee.avatar}
                    sizeClassName="h-5 w-5 shrink-0"
                  />
                  <span className="truncate font-semibold text-foreground/90">{resolvedAssignee.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground/60 italic text-[10px] truncate">{t('unassigned')}</span>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 shrink-0 text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md border border-border/40 font-medium">
                <CalendarDays className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
