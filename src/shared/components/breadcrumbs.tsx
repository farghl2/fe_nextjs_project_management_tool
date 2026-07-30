'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/shared/components/ui/breadcrumb';
import { Link } from '@/src/i18n/routing';

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItemType[];
  className?: string;
}

export function AppBreadcrumbs({ items, className }: AppBreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="font-medium text-foreground">{item.label}</BreadcrumbPage>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="rtl:rotate-180" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
