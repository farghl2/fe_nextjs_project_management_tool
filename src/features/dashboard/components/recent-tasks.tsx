'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/card';
import { Button } from '@/src/shared/components/ui/button';
import { StatusBadge } from '@/src/shared/components/status-badge';
import { PriorityBadge } from '@/src/shared/components/priority-badge';
import { LoadingState } from '@/src/shared/components/loading-state';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { useRecentTasks } from '../hooks/use-dashboard-data';
import { ListTodo, ArrowRight, CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

export function RecentTasks() {
  const t = useTranslations('dashboard');
  const { data: tasks, isLoading, isError, refetch } = useRecentTasks();

  return (
    <Card className="border-border/80 shadow-2xs h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">{t('recent_tasks')}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
          <Link href="/tasks">
            <span>{t('view_all')}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {isLoading && <LoadingState type="table" count={3} />}

        {isError && (
          <ErrorState
            title={t('tasks_error')}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (!tasks || tasks.length === 0) && (
          <EmptyState
            icon={ListTodo}
            title={t('no_recent_tasks')}
            description={t('no_recent_tasks_desc')}
          />
        )}

        {!isLoading && !isError && tasks && tasks.length > 0 && (
          <div className="divide-y divide-border/60">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 transition-colors hover:bg-muted/40 px-2 rounded-lg"
              >
                <div className="space-y-0.5 min-w-0 max-w-[60%]">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
