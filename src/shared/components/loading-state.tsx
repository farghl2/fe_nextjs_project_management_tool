'use client';

import React from 'react';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { Skeleton } from '@/src/shared/components/ui/skeleton';
import { cn } from '@/src/lib/utils';

interface LoadingStateProps {
  type?: 'card' | 'table' | 'stats' | 'page';
  count?: number;
  className?: string;
}

export function LoadingState({ type = 'card', count = 3, className }: LoadingStateProps) {
  if (type === 'stats') {
    return (
      <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="border-border/60">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className="h-10 w-full rounded-md" />
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className={cn('space-y-6 p-6', className)}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/60">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
