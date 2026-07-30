'use client';

import React from 'react';
import { Button } from '@/src/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  totalItems?: number;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50, 100],
  totalItems,
  className,
}: PaginationProps) {
  const t = useTranslations('common');
  const tTasks = useTranslations('tasks');

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  // Generate page numbers range to display (e.g., max 5 visible page numbers)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (safeCurrentPage < safeTotalPages - 2) pages.push('...');
      pages.push(safeTotalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60 text-xs text-muted-foreground',
        className
      )}
    >
      {/* Left side: Page indicator & Per page selector */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium">
          {tTasks('page_indicator', { page: safeCurrentPage, total: safeTotalPages })}
          {totalItems !== undefined && (
            <span className="ms-1.5 text-muted-foreground/70">({totalItems} total)</span>
          )}
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium">
              {tTasks('rows_per_page')}:
            </span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="h-8 text-xs w-[75px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                {limitOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right side: Page navigation (Prev, Page Numbers, Next) */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="h-8 gap-1 px-2.5 text-xs font-medium"
        >
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          <span>{tTasks('prev')}</span>
        </Button>

        {/* Page Number Buttons */}
        <div className="hidden md:flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            typeof p === 'number' ? (
              <Button
                key={p}
                variant={p === safeCurrentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(p)}
                className={cn(
                  'h-8 w-8 p-0 text-xs font-semibold',
                  p === safeCurrentPage && 'shadow-2xs'
                )}
              >
                {p}
              </Button>
            ) : (
              <span key={`dots-${idx}`} className="px-1 text-muted-foreground">
                ...
              </span>
            )
          )}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages}
          className="h-8 gap-1 px-2.5 text-xs font-medium"
        >
          <span>{tTasks('next')}</span>
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
