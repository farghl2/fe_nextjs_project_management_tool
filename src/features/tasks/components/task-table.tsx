'use client';

import React from 'react';
import { Task } from '../types/task.types';
import { resolveTaskAssignee } from './task-card';
import { StatusBadge } from '@/src/shared/components/status-badge';
import { PriorityBadge } from '@/src/shared/components/priority-badge';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Button } from '@/src/shared/components/ui/button';
import { CalendarDays, Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/src/shared/providers/auth-context';
import type { ProjectMember } from '@/src/shared/types/api.types';

interface TaskTableProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  members?: ProjectMember[];
}

export function TaskTable({ tasks, onTaskClick, onEdit, onDelete, members = [] }: TaskTableProps) {
  const t = useTranslations('tasks');
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <div>
      {/* Mobile Card List */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {tasks.map((task) => {
          const assignee = resolveTaskAssignee(task, members);
          return (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className="bg-card p-4 rounded-2xl border border-border/80 space-y-3 shadow-2xs cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                {assignee ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <UserAvatar name={assignee.name} image={assignee.avatar} sizeClassName="h-5 w-5" />
                    <span className="truncate">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="italic text-[11px]">{t('unassigned')}</span>
                )}

                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-start">
                <th className="py-3 px-4 text-start">{t('table_title')}</th>
                <th className="py-3 px-4 text-start">{t('table_status')}</th>
                <th className="py-3 px-4 text-start">{t('table_priority')}</th>
                <th className="py-3 px-4 text-start">{t('table_assignee')}</th>
                <th className="py-3 px-4 text-start">{t('table_due_date')}</th>
                <th className="py-3 px-4 text-end">{t('table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {tasks.map((task) => {
                const assignee = resolveTaskAssignee(task, members);
                return (
                  <tr
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground truncate">{task.title}</span>
                        {task.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-xs">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar name={assignee.name} image={assignee.avatar} sizeClassName="h-6 w-6" />
                          <span className="text-xs font-medium text-foreground truncate">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">{t('unassigned')}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-end" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onTaskClick?.(task)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title={t('view')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin && onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(task)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title={t('edit')}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {isAdmin && onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(task)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title={t('delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
