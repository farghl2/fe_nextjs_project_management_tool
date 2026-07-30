'use client';

import React from 'react';
import { Skeleton } from '@/src/shared/components/ui/skeleton';

export function UserTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-2xs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
