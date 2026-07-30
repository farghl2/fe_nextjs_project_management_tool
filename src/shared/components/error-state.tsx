'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import { cn } from '@/src/lib/utils';
import { useTranslations } from 'next-intl';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, message, onRetry, className }: ErrorStateProps) {
  const t = useTranslations('common');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-foreground shadow-2xs',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3 shadow-xs">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title || t('error')}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5 leading-relaxed">
        {message || 'An error occurred while loading data.'}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          className="gap-2 font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm px-4"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t('retry')}</span>
        </Button>
      )}
    </div>
  );
}
