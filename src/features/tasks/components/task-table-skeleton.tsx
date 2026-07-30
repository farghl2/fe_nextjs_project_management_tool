'use client';

import React from 'react';
import { Skeleton } from '@/src/shared/components/ui/skeleton';

export function TaskTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-2xs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="space-y-1.5 flex-1 max-w-sm">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
