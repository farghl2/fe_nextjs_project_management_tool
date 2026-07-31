import React from 'react';
import { AppShell } from '@/src/shared/components/layout/app-shell';
import { PageContainer } from '@/src/shared/components/layout/page-container';
import { PageHeader } from '@/src/shared/components/page-header';
import { DashboardOverview } from '@/src/features/dashboard';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');
  const tNav = await getTranslations('navigation');

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={t('page_header_title')}
          description={t('page_header_desc')}
          breadcrumbs={[
            { label: tNav('home'), href: '/dashboard' },
            { label: tNav('dashboard') },
          ]}
        />
        <DashboardOverview />
      </PageContainer>
    </AppShell>
  );
}
