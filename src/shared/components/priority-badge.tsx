'use client';

import { Badge } from '@/src/shared/components/ui/badge';
import { cn } from '@/src/lib/utils';
import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface PriorityBadgeProps {
  priority: TaskPriority | string;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const t = useTranslations('priority');

  const normalizedPriority = (priority || '').toUpperCase();

  const getPriorityConfig = () => {
    switch (normalizedPriority) {
      case 'URGENT':
        return {
          label: t('urgent'),
          variant: 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20',
          icon: AlertTriangle,
        };
      case 'HIGH':
        return {
          label: t('high'),
          variant: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20',
          icon: ArrowUp,
        };
      case 'MEDIUM':
        return {
          label: t('medium'),
          variant: 'bg-info/15 text-info border-info/30 hover:bg-info/20',
          icon: ArrowRight,
        };
      case 'LOW':
      default:
        return {
          label: t('low'),
          variant: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
          icon: ArrowDown,
        };
    }
  };

  const config = getPriorityConfig();
  const IconComponent = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border rounded-md transition-colors', config.variant, className)}
    >
      {showIcon && <IconComponent className="h-3 w-3 shrink-0" />}
      <span>{config.label}</span>
    </Badge>
  );
}
