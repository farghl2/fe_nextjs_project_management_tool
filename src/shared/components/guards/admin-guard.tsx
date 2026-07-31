'use client';

import React from 'react';
import { useAuth } from '@/src/shared/providers/auth-context';
import { Button } from '@/src/shared/components/ui/button';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { Link } from '@/src/i18n/routing';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { role, isLoading } = useAuth();
  const tNav = useTranslations('navigation');

  if (isLoading) return null;

  if (role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="max-w-md w-full border-destructive/30 bg-destructive/5 shadow-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-foreground">Access Denied</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You do not have Administrator permissions to access User Management. Please contact your workspace administrator.
              </p>
            </div>

            <div className="pt-2">
              <Button asChild className="gap-2 font-semibold shadow-xs">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  <span>{tNav('dashboard')}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
