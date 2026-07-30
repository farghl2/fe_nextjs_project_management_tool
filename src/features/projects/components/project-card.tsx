'use client';

import React from 'react';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { StatusBadge } from '@/src/shared/components/status-badge';
import { Project } from '../types/project.types';
import { useProjectMembersQuery } from '../hooks/use-project-members';
import { FolderKanban, Users, ListTodo, MoreVertical, Pencil, Trash2, CalendarDays } from 'lucide-react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { Link } from '@/src/i18n/routing';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { role } = useAuth();
  const t = useTranslations('projects');
  const isAdmin = role === 'ADMIN';

  // Fetch real member count only when the backend omits it from the list response
  const needsMembersQuery =
    project.membersCount === undefined && project.members === undefined;
  const { data: membersData } = useProjectMembersQuery(
    needsMembersQuery ? project.id : ''
  );

  const membersCount =
    project.membersCount ??
    project.members?.length ??
    membersData?.meta?.total;

  const tasksCount = project.tasksCount;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="relative overflow-hidden transition-all duration-200 border-border/80 hover:shadow-md group">
        <Link href={`/projects/${project.id}`} className="block">
          <CardContent className="p-5 space-y-4">
            {/* Header: Icon, Status, Menu */}
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FolderKanban className="h-5.5 w-5.5" />
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={project.status || 'ACTIVE'} />

                {isAdmin && (onEdit || onDelete) && (
                  <div onClick={(e) => e.preventDefault()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Project actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 border-border">
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(project);
                            }}
                            className="gap-2 cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>{t('edit')}</span>
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(project);
                              }}
                              className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{t('delete')}</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {project.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                {project.description || t('no_description')}
              </p>
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="h-3.5 w-3.5 text-primary/80" />
                  {membersCount ?? '—'} {t('members_suffix')}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <ListTodo className="h-3.5 w-3.5 text-info" />
                  {tasksCount ?? '—'} {t('tasks_suffix')}
                </span>
              </div>

              {project.createdAt && (
                <div className="flex items-center gap-1 text-[11px]">
                  <CalendarDays className="h-3 w-3" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
