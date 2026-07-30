'use client';

import React from 'react';
import { FileQuestion, LayoutDashboard } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border bg-card shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto">
          <FileQuestion className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Error 404</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Page Not Found</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page you are looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>
        <div className="pt-2">
          <Button onClick={() => (window.location.href = '/dashboard')} size="sm" className="gap-2 font-medium">
            <LayoutDashboard className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
}