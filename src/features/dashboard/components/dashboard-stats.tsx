'use client';

import React from 'react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { MetricCard } from '@/src/shared/components/metric-card';
import { LoadingState } from '@/src/shared/components/loading-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { useDashboardStats } from '../hooks/use-dashboard-data';
import { FolderKanban, Users, ListTodo, Clock, CircleCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function DashboardStats() {
  const { role } = useAuth();
  const t = useTranslations('dashboard');
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) {
    return <LoadingState type="stats" count={role === 'ADMIN' ? 5 : 4} />;
  }

  if (isError || !stats) {
    return (
      <ErrorState
        title={t('stats_error_title')}
        message={t('stats_error_desc')}
        onRetry={refetch}
      />
    );
  }

  const isAdmin = role === 'ADMIN';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <MetricCard
        title={isAdmin ? t('total_projects') : t('my_projects')}
        value={stats.totalProjects}
        icon={FolderKanban}
        variant="primary"
      />

      {isAdmin && (
        <MetricCard
          title={t('total_users')}
          value={stats.totalUsers ?? 0}
          icon={Users}
          variant="info"
        />
      )}

      <MetricCard
        title={isAdmin ? t('total_tasks') : t('my_tasks')}
        value={stats.totalTasks}
        icon={ListTodo}
        variant="default"
      />

      <MetricCard
        title={t('in_progress')}
        value={stats.inProgressTasks}
        icon={Clock}
        variant="warning"
      />

      <MetricCard
        title={t('completed')}
        value={stats.completedTasks}
        icon={CircleCheck}
        variant="success"
      />
    </div>
  );
}
