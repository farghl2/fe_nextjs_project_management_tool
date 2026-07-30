import React from 'react';
import { Sparkles } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-pulse">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight">Done Workspace</h2>
          <p className="text-xs text-muted-foreground">Preparing your application environment...</p>
        </div>
      </div>
    </div>
  );
}