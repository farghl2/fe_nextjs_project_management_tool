'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { LoadingState } from '@/src/shared/components/loading-state';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { useRecentProjects } from '../hooks/use-dashboard-data';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import { format } from 'date-fns';

export function RecentProjects() {
  const t = useTranslations('dashboard');
  const { data: projects, isLoading, isError, refetch } = useRecentProjects();

  return (
    <Card className="border-border/80 shadow-2xs h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">{t('recent_projects')}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
          <Link href="/projects">
            <span>{t('view_all')}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {isLoading && <LoadingState type="table" count={3} />}

        {isError && (
          <ErrorState
            title={t('projects_error')}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (!projects || projects.length === 0) && (
          <EmptyState
            icon={FolderKanban}
            title={t('no_recent_projects')}
            description={t('no_recent_projects_desc')}
          />
        )}

        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="divide-y divide-border/60">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between py-3 transition-colors hover:bg-muted/40 px-2 rounded-lg block"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {project.name}
                  </h4>
                  {project.description ? (
                    <p className="text-xs text-muted-foreground truncate">
                      {project.description}
                    </p>
                  ) : project.createdAt ? (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
