'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteUsersQuery } from '@/src/features/users/hooks/use-infinite-users';
import { UserAvatar } from './user-avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Spinner } from './ui/spinner';
import { cn } from '@/src/lib/utils';
import { Check, ChevronsUpDown, Search, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { User } from '@/src/shared/types/api.types';

// The sentinel used in form fields — never sent to the API
export const UNASSIGNED = '__unassigned__';

interface AssigneeSelectProps {
  /** Current value — a real userId OR the UNASSIGNED sentinel OR '' */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function AssigneeSelect({
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
}: AssigneeSelectProps) {
  const t = useTranslations('tasks');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Debounce search input by 300 ms
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteUsersQuery(debouncedSearch);

  // Flatten all pages into a single array
  const allUsers: User[] = data?.pages.flatMap((p) => p.data) ?? [];

  // Find the currently selected user object for display in the trigger
  const selectedUser = allUsers.find((u) => u.id === value);

  // IntersectionObserver — fires fetchNextPage when the sentinel div enters view
  const handleSentinel = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleSentinel, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleSentinel]);

  // Reset search when popover closes
  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const isUnassigned = !value || value === UNASSIGNED;
  const displayLabel = isUnassigned
    ? (placeholder ?? t('select_assignee'))
    : selectedUser
    ? (selectedUser.name || selectedUser.email || 'User')
    : (placeholder ?? t('select_assignee'));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between text-xs font-normal h-9 px-3',
            isUnassigned && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            {!isUnassigned && selectedUser && (
              <UserAvatar
                name={selectedUser.name || selectedUser.email}
                image={selectedUser.avatar ?? selectedUser.image}
                sizeClassName="h-5 w-5"
              />
            )}
            {isUnassigned && <UserX className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <span className="truncate">{displayLabel}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground ms-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[260px] p-0 border-border shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search_assignee')}
            className="h-7 border-0 p-0 text-xs focus-visible:ring-0 bg-transparent"
            autoFocus
          />
        </div>

        {/* List */}
        <div className="max-h-52 overflow-y-auto py-1">
          {/* Unassigned option */}
          <button
            type="button"
            onClick={() => {
              onChange(UNASSIGNED);
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-accent transition-colors',
              isUnassigned && 'bg-accent/60 font-medium'
            )}
          >
            <UserX className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="flex-1 text-start text-muted-foreground">{t('unassigned')}</span>
            {isUnassigned && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
          </button>

          {/* Loading initial page */}
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Spinner className="h-4 w-4" />
            </div>
          )}

          {/* No results */}
          {!isLoading && allUsers.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              {t('no_users_found')}
            </p>
          )}

          {/* User rows */}
          {allUsers.map((user) => {
            const isSelected = user.id === value;
            const userName = user.name || user.email || 'User';
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  onChange(isSelected ? UNASSIGNED : user.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-accent transition-colors',
                  isSelected && 'bg-accent/60 font-medium'
                )}
              >
                <UserAvatar
                  name={userName}
                  image={user.avatar ?? user.image}
                  sizeClassName="h-6 w-6"
                />
                <div className="flex-1 min-w-0 text-start">
                  <p className="truncate font-medium text-foreground">{userName}</p>
                  {user.email && (
                    <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                  )}
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            );
          })}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-1 flex justify-center">
            {isFetchingNextPage && <Spinner className="h-3.5 w-3.5" />}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
