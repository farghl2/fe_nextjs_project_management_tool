'use client';

import React from 'react';
import { UserItem } from '../types/user.types';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import { Switch } from '@/src/shared/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserCard } from './user-card';
import { cn } from '@/src/lib/utils';

interface UserTableProps {
  users: UserItem[];
  onEdit?: (user: UserItem) => void;
  onDelete?: (user: UserItem) => void;
  onToggleStatus?: (user: UserItem, isActive: boolean) => void;
  updatingStatusUserId?: string | null;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  updatingStatusUserId,
}: UserTableProps) {
  const t = useTranslations('users');

  return (
    <div>
      {/* Mobile Card List */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            updatingStatusUserId={updatingStatusUserId}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-start">
                <th className="py-3 px-4 text-start">{t('table_user')}</th>
                <th className="py-3 px-4 text-start">{t('table_job')}</th>
                <th className="py-3 px-4 text-start">{t('table_role')}</th>
                <th className="py-3 px-4 text-start">{t('table_status')}</th>
                <th className="py-3 px-4 text-start">{t('table_created')}</th>
                <th className="py-3 px-4 text-end">{t('table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} sizeClassName="h-9 w-9" />
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-foreground truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-muted-foreground">
                    {user.job || '—'}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-mono py-0.5 px-2.5 ${
                        user.role === 'ADMIN'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>

                  {/* Optimistic Active Status Switch Column */}
                  <td className="py-3.5 px-4">
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
                  </td>

                  <td className="py-3.5 px-4 text-xs text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>

                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(user)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title={t('edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(user)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title={t('delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
