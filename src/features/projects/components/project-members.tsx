'use client';

import React from 'react';
import { useProjectMembers } from '../hooks/use-project-members';
import { useRemoveProjectMember } from '../hooks/use-project-mutations';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Badge } from '@/src/shared/components/ui/badge';
import { Button } from '@/src/shared/components/ui/button';
import { LoadingState } from '@/src/shared/components/loading-state';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { useAuth } from '@/src/shared/providers/auth-context';
import { Users, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProjectMembersProps {
  projectId: string;
  onAddMember?: () => void;
}

export function ProjectMembers({ projectId, onAddMember }: ProjectMembersProps) {
  const t = useTranslations('projects');
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const { data: members, isLoading, isError, refetch } = useProjectMembers(projectId);
  const removeMutation = useRemoveProjectMember(projectId);

  const handleRemove = async (targetId?: string) => {
    if (!targetId || targetId === 'undefined') {
      console.error('Cannot remove member: target user ID is undefined');
      return;
    }
    try {
      await removeMutation.mutateAsync(targetId);
    } catch (e) {
      console.error('Remove member error:', e);
    }
  };

  if (isLoading) return <LoadingState type="table" count={4} />;
  if (isError) return <ErrorState title={t('members_error')} onRetry={refetch} />;

  if (!members || members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t('no_members_title')}
        description={t('no_members_desc')}
        actionLabel={isAdmin ? t('add_member') : undefined}
        onAction={isAdmin ? onAddMember : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span>{t('project_members')}</span>
          <Badge variant="outline" className="text-xs">
            {members.length}
          </Badge>
        </h3>

        {isAdmin && onAddMember && (
          <Button onClick={onAddMember} size="sm" variant="outline" className="h-8 text-xs">
            {t('add_member')}
          </Button>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border/80 divide-y divide-border/50 overflow-hidden shadow-2xs">
        {members.map((member) => {
          const targetUserId = member.userId || member.user?.id || member.id;
          return (
            <div
              key={targetUserId || member.id}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <UserAvatar
                  name={member.user?.name || 'Member'}
                  image={member.user?.avatar}
                  sizeClassName="h-9 w-9"
                />
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {member.user?.name || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {member.user?.email || ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase font-mono py-0 px-2 ${
                    (member.role || member.user?.role) === 'ADMIN'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.role || member.user?.role || 'MEMBER'}
                </Badge>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(targetUserId)}
                    disabled={removeMutation.isPending}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title={t('remove_member')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
