'use client';

import React from 'react';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { Skeleton } from '@/src/shared/components/ui/skeleton';

export function TaskBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card/50 rounded-2xl border border-border/60 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <div className="space-y-3 pt-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Card key={j} className="border-border/40">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
