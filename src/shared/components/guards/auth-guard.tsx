'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { useRouter, usePathname } from '@/src/i18n/routing';
import { Kanban } from 'lucide-react';
import { Spinner } from '@/src/shared/components/ui/spinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md animate-pulse">
          <Kanban className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Spinner className="h-4 w-4 text-primary" />
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
