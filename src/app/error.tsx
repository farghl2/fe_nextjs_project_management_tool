'use client';

import React from 'react';
import { TriangleAlert, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-destructive/20 bg-card shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
          <TriangleAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Something went wrong</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An unexpected application error occurred. Please try refreshing or return to the dashboard.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="default" size="sm" className="gap-2 font-medium">
            <RefreshCw className="h-4 w-4" />
            <span>Try again</span>
          </Button>
          <Button onClick={() => (window.location.href = '/dashboard')} variant="outline" size="sm" className="gap-2 font-medium">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
