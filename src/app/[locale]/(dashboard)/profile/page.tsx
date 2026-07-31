import React from 'react';
import { AppShell } from '@/src/shared/components/layout/app-shell';
import { PageContainer } from '@/src/shared/components/layout/page-container';
import { PageHeader } from '@/src/shared/components/page-header';
import { ProfilePage } from '@/src/features/profile';
import { getTranslations } from 'next-intl/server';

export default async function ProfileRoutePage() {
  const t = await getTranslations('profile');
  const tNav = await getTranslations('navigation');

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={t('page_title')}
          description={t('page_desc')}
          breadcrumbs={[
            { label: tNav('home'), href: '/dashboard' },
            { label: tNav('profile') },
          ]}
        />
        <ProfilePage />
      </PageContainer>
    </AppShell>
  );
}
