'use client';

import React from 'react';
import { AppBreadcrumbs, BreadcrumbItemType } from './breadcrumbs';
import { cn } from '@/src/lib/utils';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemType[];
  actions?: React.ReactNode;
  className?: string;
  badge?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  badge,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-r from-card via-card to-primary/5 border border-border/80 p-5 sm:p-7 shadow-xs mb-6',
        className
      )}
    >
      {/* Background Decorative Accent */}
      <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative space-y-3">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <AppBreadcrumbs items={breadcrumbs} className="mb-2" />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0 flex-1">
            {badge && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                <span>{badge}</span>
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent sm:text-2xl md:text-3xl truncate">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40 w-full lg:w-auto">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
