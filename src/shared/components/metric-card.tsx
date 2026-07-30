'use client';

import React from 'react';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { cn } from '@/src/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export type MetricVariant = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'destructive';

interface MetricCardProps {
  title: string;
  value: string | number | undefined;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
  variant?: MetricVariant;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          iconBg: 'bg-primary/10 text-primary',
          borderAccent: 'border-l-4 border-l-primary',
        };
      case 'success':
        return {
          iconBg: 'bg-success/10 text-success',
          borderAccent: 'border-l-4 border-l-success',
        };
      case 'warning':
        return {
          iconBg: 'bg-warning/10 text-warning',
          borderAccent: 'border-l-4 border-l-warning',
        };
      case 'info':
        return {
          iconBg: 'bg-info/10 text-info',
          borderAccent: 'border-l-4 border-l-info',
        };
      case 'destructive':
        return {
          iconBg: 'bg-destructive/10 text-destructive',
          borderAccent: 'border-l-4 border-l-destructive',
        };
      case 'default':
      default:
        return {
          iconBg: 'bg-muted text-muted-foreground',
          borderAccent: '',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn('relative overflow-hidden transition-shadow duration-200 hover:shadow-md border-border/80', styles.borderAccent, className)}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">{value ?? 0}</span>
                {trend && (
                  <span
                    className={cn(
                      'inline-flex items-center text-xs font-medium gap-0.5',
                      trend.isPositive ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {trend.value}
                  </span>
                )}
              </div>
              {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </div>

            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl p-3 shadow-2xs', styles.iconBg)}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
