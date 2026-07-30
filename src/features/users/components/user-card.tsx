'use client';

import React from 'react';
import { UserItem } from '../types/user.types';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import { Switch } from '@/src/shared/components/ui/switch';
import { Pencil, Trash2, Briefcase } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/lib/utils';

interface UserCardProps {
  user: UserItem;
  onEdit?: (user: UserItem) => void;
  onDelete?: (user: UserItem) => void;
  onToggleStatus?: (user: UserItem, isActive: boolean) => void;
  updatingStatusUserId?: string | null;
}

export function UserCard({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserCardProps) {
  const t = useTranslations('users');

  return (
    <div className="bg-card p-4 rounded-2xl border border-border/80 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <UserAvatar user={user} sizeClassName="h-10 w-10" />
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-[10px] uppercase font-mono py-0 px-2 shrink-0 ${
            user.role === 'ADMIN'
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {user.role}
        </Badge>
      </div>

      {user.job && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/40">
          <Briefcase className="h-3.5 w-3.5 text-primary/70" />
          <span>{user.job}</span>
        </div>
      )}

      {/* Optimistic active status toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-xs font-medium text-muted-foreground">{t('table_status')}</span>
        <div className="flex items-center gap-2">
          <Switch
            checked={user.isActive}
            onCheckedChange={(checked) => onToggleStatus?.(user, checked)}
          />
          <span
            className={cn(
              'text-xs font-semibold transition-colors',
              user.isActive ? 'text-success' : 'text-muted-foreground'
            )}
          >
            {user.isActive ? t('active') : t('inactive')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)} className="h-8 gap-1 text-xs">
            <Pencil className="h-3.5 w-3.5" />
            <span>{t('edit')}</span>
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user)}
            className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t('delete')}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
