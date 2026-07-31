'use client';

import { Badge } from '@/src/shared/components/ui/badge';
import { cn } from '@/src/lib/utils';
import { CircleDot, CircleCheck, Clock, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';

interface StatusBadgeProps {
  status: TaskStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const t = useTranslations('status');

  const normalizedStatus = (status || '').toUpperCase();

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case 'COMPLETED':
      case 'DONE':
        return {
          label: t('completed'),
          variant: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
          icon: CircleCheck,
        };
      case 'IN_PROGRESS':
      case 'PROGRESS':
        return {
          label: t('in_progress'),
          variant: 'bg-info/15 text-info border-info/30 hover:bg-info/20',
          icon: Clock,
        };
      case 'IN_REVIEW':
      case 'REVIEW':
        return {
          label: t('in_review'),
          variant: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20',
          icon: CircleDot,
        };
      case 'CANCELLED':
        return {
          label: t('cancelled'),
          variant: 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20',
          icon: AlertCircle,
        };
      case 'TODO':
      case 'PENDING':
      default:
        return {
          label: t('todo'),
          variant: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
          icon: CircleDot,
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border rounded-full transition-colors', config.variant, className)}
    >
      {showIcon && <IconComponent className="h-3 w-3 shrink-0" />}
      <span>{config.label}</span>
    </Badge>
  );
}
