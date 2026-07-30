'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserAvatar } from './user-avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/src/lib/utils';
import { Check, ChevronsUpDown, Search, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ProjectMember } from '@/src/shared/types/api.types';

export const UNASSIGNED_MEMBER = '__unassigned__';

interface MemberSelectProps {
  value: string;
  onChange: (value: string) => void;
  members: ProjectMember[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/** Resolve a display name from a member — always returns human readable name or email */
function getMemberName(member?: ProjectMember): string {
  if (!member) return 'Member';
  return (
    member.user?.name ||
    member.user?.email ||
    'Member'
  );
}

/** Resolve the id to use for matching — prefer userId safely */
function getMemberId(member?: ProjectMember): string {
  if (!member) return '';
  return member.userId || member.user?.id || member.id || '';
}

export function MemberSelect({
  value,
  onChange,
  members = [],
  disabled = false,
  placeholder,
  className,
}: MemberSelectProps) {
  const t = useTranslations('tasks');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const safeMembers = Array.isArray(members) ? members.filter(Boolean) : [];

  const filtered = search.trim()
    ? safeMembers.filter((m) => {
        const name = getMemberName(m).toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || (m.user?.email || '').toLowerCase().includes(q);
      })
    : safeMembers;

  const isUnassigned = !value || value === UNASSIGNED_MEMBER;
  const selectedMember = safeMembers.find((m) => getMemberId(m) === value);
  const displayLabel = isUnassigned
    ? (placeholder ?? t('select_assignee'))
    : selectedMember
    ? getMemberName(selectedMember)
    : (placeholder ?? t('select_assignee'));

  const handleSelect = useCallback(
    (memberId: string) => {
      onChange(memberId === value ? UNASSIGNED_MEMBER : memberId);
      setOpen(false);
    },
    [value, onChange]
  );

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
            {!isUnassigned && selectedMember && (
              <UserAvatar
                name={getMemberName(selectedMember)}
                image={selectedMember.user?.avatar ?? selectedMember.user?.image}
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
        {/* Search */}
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
        <div ref={listRef} className="max-h-52 overflow-y-auto py-1">
          {/* Unassigned */}
          <button
            type="button"
            onClick={() => { onChange(UNASSIGNED_MEMBER); setOpen(false); }}
            className={cn(
              'flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-accent transition-colors',
              isUnassigned && 'bg-accent/60 font-medium'
            )}
          >
            <UserX className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="flex-1 text-start text-muted-foreground">{t('unassigned')}</span>
            {isUnassigned && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
          </button>

          {filtered.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">{t('no_users_found')}</p>
          )}

          {filtered.map((member, idx) => {
            const memberId = getMemberId(member) || `member-${idx}`;
            const memberName = getMemberName(member);
            const isSelected = memberId === value;
            return (
              <button
                key={memberId}
                type="button"
                onClick={() => handleSelect(memberId)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-xs hover:bg-accent transition-colors',
                  isSelected && 'bg-accent/60 font-medium'
                )}
              >
                <UserAvatar
                  name={memberName}
                  image={member.user?.avatar ?? member.user?.image}
                  sizeClassName="h-6 w-6"
                />
                <div className="flex-1 min-w-0 text-start">
                  <p className="truncate font-medium text-foreground">{memberName}</p>
                  {member.user?.email && (
                    <p className="truncate text-[10px] text-muted-foreground">{member.user.email}</p>
                  )}
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
