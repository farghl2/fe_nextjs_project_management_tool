'use client';

import React from 'react';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { Skeleton } from '@/src/shared/components/ui/skeleton';

export function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full max-w-xl" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-border/40">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
