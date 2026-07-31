'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import { Search, ArrowUpDown, X, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useUserParams } from '../hooks/use-user-params';

interface UsersToolbarProps {
  onCreateUser?: () => void;
}

export function UsersToolbar({ onCreateUser }: UsersToolbarProps) {
  const t = useTranslations('users');
  const { search, sortBy, sortOrder, setSearch, setSortBy, setSortOrder, clearFilters } =
    useUserParams();

  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch]);

  const hasActiveFilters = Boolean(search || sortBy !== 'name' || sortOrder !== 'asc');

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-2xs">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t('search_placeholder')}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="ps-9 pe-9 h-9 text-xs"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                setSearch('');
              }}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 text-xs w-[140px]">
              <SelectValue placeholder={t('sort_by')} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="name">{t('sort_name')}</SelectItem>
              <SelectItem value="email">{t('sort_email')}</SelectItem>
              <SelectItem value="createdAt">{t('sort_created')}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-9 w-9 border-border/60"
            title={sortOrder === 'asc' ? t('sort_asc') : t('sort_desc')}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocalSearch('');
                clearFilters();
              }}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t('clear')}</span>
            </Button>
          )}
        </div>
      </div>

      {onCreateUser && (
        <Button onClick={onCreateUser} size="sm" className="h-9 gap-1.5 font-semibold shadow-xs">
          <UserPlus className="h-4 w-4" />
          <span>{t('create_user')}</span>
        </Button>
      )}
    </div>
  );
}
