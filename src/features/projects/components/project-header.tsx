'use client';

import React from 'react';
import { Project } from '../types/project.types';
import { StatusBadge } from '@/src/shared/components/status-badge';
import { Button } from '@/src/shared/components/ui/button';
import { FolderKanban, CalendarDays, Users, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { useTranslations } from 'next-intl';

interface ProjectHeaderProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddMember?: () => void;
}

export function ProjectHeader({ project, onEdit, onDelete, onAddMember }: ProjectHeaderProps) {
  const { role } = useAuth();
  const t = useTranslations('projects');
  const isAdmin = role === 'ADMIN';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border/80 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {project.name}
                </h1>
                <StatusBadge status={project.status || 'ACTIVE'} />
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {project.description || t('no_description')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1 font-medium">
              <Users className="h-3.5 w-3.5 text-primary" />
              {project.membersCount ?? project.members?.length ?? 0} {t('members_suffix')}
            </span>
            {project.createdAt && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls for ADMIN */}
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onAddMember && (
              <Button onClick={onAddMember} size="sm" variant="outline" className="gap-1.5 h-9">
                <UserPlus className="h-4 w-4" />
                <span>{t('add_member')}</span>
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit} size="sm" variant="outline" className="gap-1.5 h-9">
                <Pencil className="h-3.5 w-3.5" />
                <span>{t('edit')}</span>
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} size="sm" variant="destructive" className="gap-1.5 h-9">
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t('delete')}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
