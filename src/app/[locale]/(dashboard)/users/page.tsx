import React from 'react';
import { AppShell } from '@/src/shared/components/layout/app-shell';
import { PageContainer } from '@/src/shared/components/layout/page-container';
import { PageHeader } from '@/src/shared/components/page-header';
import { UsersPage } from '@/src/features/users';
import { AdminGuard } from '@/src/shared/components/guards';
import { getTranslations } from 'next-intl/server';

export default async function UsersRoutePage() {
  const t = await getTranslations('users');
  const tNav = await getTranslations('navigation');

  return (
    <AppShell>
      <PageContainer>
        <AdminGuard>
          <PageHeader
            title={t('page_title')}
            description={t('page_desc')}
            breadcrumbs={[
              { label: tNav('home'), href: '/dashboard' },
              { label: tNav('users') },
            ]}
          />
          <UsersPage />
        </AdminGuard>
      </PageContainer>
    </AppShell>
  );
}
