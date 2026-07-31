'use client';

import React from 'react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { DashboardStats } from './dashboard-stats';
import { RecentProjects } from './recent-projects';
import { RecentTasks } from './recent-tasks';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/src/shared/components/ui/badge';
import { FadeInUp, ScaleIn } from '@/src/shared/animations';

export function DashboardOverview() {
  const { user, role } = useAuth();
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <FadeInUp delay={0.05}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/30 to-background border border-primary/20 p-6 sm:p-8 shadow-xs">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('welcome_back')}
                </span>
                {role && (
                  <Badge variant="outline" className="text-[10px] uppercase font-mono bg-primary/10 text-primary border-primary/20">
                    {role}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {user ? `${t('hello')}, ${user.name}!` : t('dashboard_title')}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                {role === 'ADMIN' ? t('admin_welcome_subtitle') : t('member_welcome_subtitle')}
              </p>
            </div>
          </div>

          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute top-0 end-0 -translate-y-6 translate-x-6 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        </div>
      </FadeInUp>

      {/* Metrics Section */}
      <ScaleIn delay={0.15}>
        <DashboardStats />
      </ScaleIn>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeInUp delay={0.25}>
          <RecentProjects />
        </FadeInUp>
        <FadeInUp delay={0.35}>
          <RecentTasks />
        </FadeInUp>
      </div>
    </div>
  );
}
