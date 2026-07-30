'use client';

import React from 'react';
import { FileQuestion, LucideIcon } from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import { cn } from '@/src/lib/utils';

interface NotFoundStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function NotFoundState({
  icon: Icon = FileQuestion,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border/80 bg-card/60',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground shadow-2xs mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      {description && <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{description}</p>}
      
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-3 mt-2">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} size="sm">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline" size="sm">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
