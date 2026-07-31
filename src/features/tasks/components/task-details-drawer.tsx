'use client';

import React from 'react';
import { Task } from '../types/task.types';
import { resolveTaskAssignee } from './task-card';
import { StatusBadge } from '@/src/shared/components/status-badge';
import { PriorityBadge } from '@/src/shared/components/priority-badge';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Button } from '@/src/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/src/shared/components/ui/sheet';
import { CalendarDays, Pencil, Trash2, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { useProjectMembers } from '@/src/features/projects/hooks/use-project-members';
import { useTranslations } from 'next-intl';

interface TaskDetailsDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskDetailsDrawer({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: TaskDetailsDrawerProps) {
  const t = useTranslations('tasks');
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  // Resolve assignee from project members when backend doesn't embed the object
  const { data: members = [] } = useProjectMembers(task?.projectId ?? '');

  if (!task) return null;

  const resolvedAssignee = resolveTaskAssignee(task, members);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full border-border p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <SheetHeader className="space-y-3 text-start border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <SheetTitle className="text-xl font-bold text-foreground leading-snug">
              {task.title}
            </SheetTitle>
            {task.createdAt && (
              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{t('created_at', { date: new Date(task.createdAt).toLocaleDateString() })}</span>
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('description')}
            </h4>
            <div className="bg-muted/40 p-4 rounded-xl border border-border/50 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {task.description || t('no_description')}
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-primary" />
                {t('assignee')}
              </span>
              {resolvedAssignee ? (
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={resolvedAssignee.name}
                    image={resolvedAssignee.avatar}
                    sizeClassName="h-7 w-7"
                  />
                  <span className="text-xs font-semibold text-foreground truncate">
                    {resolvedAssignee.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">{t('unassigned')}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-info" />
                {t('due_date')}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : t('no_due_date')}
              </span>
            </div>
          </div>
        </div>

        {/* Admin actions */}
        {isAdmin && (onEdit || onDelete) && (
          <div className="pt-6 border-t border-border/60 flex items-center justify-end gap-3 mt-6">
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onDelete(task);
                }}
                className="gap-1.5 h-9"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('delete')}</span>
              </Button>
            )}
            {onEdit && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(task);
                }}
                className="gap-1.5 h-9 font-semibold shadow-xs"
              >
                <Pencil className="h-4 w-4" />
                <span>{t('edit')}</span>
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
