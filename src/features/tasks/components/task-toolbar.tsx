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
import { Search, ArrowUpDown, X, Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTaskParams } from '../hooks/use-task-params';
import { useProjectMembers } from '@/src/features/projects/hooks/use-project-members';
import { useAuth } from '@/src/shared/providers/auth-context';

interface TaskToolbarProps {
  projectId: string;
  onNewTask?: () => void;
}

export function TaskToolbar({ projectId, onNewTask }: TaskToolbarProps) {
  const t = useTranslations('tasks');
  const tStatus = useTranslations('status');
  const tPriority = useTranslations('priority');
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const { data: members = [] } = useProjectMembers(projectId);

  const {
    view,
    search,
    status,
    priority,
    assigneeId,
    sortBy,
    sortOrder,
    setView,
    setSearch,
    setStatus,
    setPriority,
    setAssigneeId,
    setSortBy,
    setSortOrder,
    clearFilters,
  } = useTaskParams();

  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch]);

  const hasActiveFilters = Boolean(
    search || status !== 'ALL' || priority !== 'ALL' || assigneeId !== 'ALL' || sortBy !== 'createdAt'
  );

  return (
    <div className="flex flex-col gap-3.5 bg-card p-4 rounded-2xl border border-border/80 shadow-2xs">
      {/* Section 1: Search & Main Actions (Top Row) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        {/* Search Input */}
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
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher & New Task Action */}
        <div className="flex items-center gap-2.5 justify-end">
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setView('board')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                view === 'board'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{t('view_board')}</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                view === 'list'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>{t('view_list')}</span>
            </button>
          </div>

          {isAdmin && onNewTask && (
            <Button onClick={onNewTask} size="sm" className="h-9 gap-1.5 font-semibold shadow-xs">
              <Plus className="h-4 w-4" />
              <span>{t('new_task')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Section 2: Filters & Sorting (Bottom Row) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground me-1">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Filters:</span>
          </div>

          {/* Status Select */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-background">
              <SelectValue placeholder={t('filter_status')} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">{t('all_statuses')}</SelectItem>
              <SelectItem value="TODO">{tStatus('todo')}</SelectItem>
              <SelectItem value="IN_PROGRESS">{tStatus('in_progress')}</SelectItem>
              <SelectItem value="IN_REVIEW">{tStatus('in_review')}</SelectItem>
              <SelectItem value="DONE">{tStatus('completed')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Select */}
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-background">
              <SelectValue placeholder={t('filter_priority')} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">{t('all_priorities')}</SelectItem>
              <SelectItem value="LOW">{tPriority('low')}</SelectItem>
              <SelectItem value="MEDIUM">{tPriority('medium')}</SelectItem>
              <SelectItem value="HIGH">{tPriority('high')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee Select (Project Members only) */}
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger className="h-9 text-xs w-[150px] bg-background">
              <SelectValue placeholder={t('filter_assignee')} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="ALL">{t('all_assignees')}</SelectItem>
              {members.map((m) => {
                const id = m.userId || m.user?.id || m.id || '';
                const name = m.user?.name || m.user?.email || 'Member';
                if (!id) return null;
                return (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-background">
              <SelectValue placeholder={t('sort_by')} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="createdAt">{t('sort_created')}</SelectItem>
              <SelectItem value="title">{t('sort_title')}</SelectItem>
              <SelectItem value="priority">{t('sort_priority')}</SelectItem>
              <SelectItem value="dueDate">{t('sort_due_date')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-9 w-9 border-border/60 bg-background"
            title={sortOrder === 'asc' ? t('sort_asc') : t('sort_desc')}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalSearch('');
              clearFilters();
            }}
            className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
          >
            <X className="h-3.5 w-3.5" />
            <span>{t('clear')}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
