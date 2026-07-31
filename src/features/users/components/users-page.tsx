'use client';

import React, { useState } from 'react';
import { useUsers } from '../hooks/use-users';
import { useUserParams } from '../hooks/use-user-params';
import { useUpdateUserStatusMutation } from '../hooks/use-user-mutations';
import { UsersToolbar } from './users-toolbar';
import { UserTable } from './user-table';
import { UserTableSkeleton } from './user-table-skeleton';
import { CreateUserDialog } from './create-user-dialog';
import { EditUserDialog } from './edit-user-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import { EmptyState } from '@/src/shared/components/empty-state';
import { ErrorState } from '@/src/shared/components/error-state';
import { Pagination } from '@/src/shared/components/pagination';
import { UserItem } from '../types/user.types';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UsersPage() {
  const t = useTranslations('users');
  const { queryParams, setPage, setLimit } = useUserParams();
  const { data: response, isLoading, isError, refetch } = useUsers(queryParams);
  const statusMutation = useUpdateUserStatusMutation();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const users = response?.data || [];
  const currentLimit = queryParams.limit || 10;

  // Safe total pages calculation
  const totalPages =
    response?.totalPages ??
    response?.meta?.totalPages ??
    (response?.meta?.total || response?.total
      ? Math.ceil((response.meta?.total || response.total || 0) / currentLimit)
      : 1);

  const currentPage = queryParams.page || 1;
  const totalItems = response?.total ?? response?.meta?.total;

  const handleToggleStatus = (user: UserItem, isActive: boolean) => {
    statusMutation.mutate({
      id: user.id,
      data: { isActive },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <UsersToolbar onCreateUser={() => setCreateOpen(true)} />

      {/* Loading Skeleton */}
      {isLoading && <UserTableSkeleton count={6} />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title={t('load_error_title')}
          message={t('load_error_desc')}
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && users.length === 0 && (
        <EmptyState
          icon={Users}
          title={t('no_users_title')}
          description={t('no_users_desc')}
          actionLabel={t('create_first_user')}
          onAction={() => setCreateOpen(true)}
        />
      )}

      {/* User Table & Pagination */}
      {!isLoading && !isError && users.length > 0 && (
        <>
          <UserTable
            users={users}
            onEdit={(u) => setEditingUser(u)}
            onDelete={(u) => setDeletingUser(u)}
            onToggleStatus={handleToggleStatus}
            updatingStatusUserId={statusMutation.isPending ? statusMutation.variables?.id : null}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            limit={currentLimit}
            limitOptions={[5, 10, 20, 50, 100]}
            totalItems={totalItems}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </>
      )}

      {/* Dialogs */}
      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />
      <DeleteUserDialog
        user={deletingUser}
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      />
    </div>
  );
}
