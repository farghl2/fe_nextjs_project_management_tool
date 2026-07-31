import React from 'react';
import { AppShell } from '@/src/shared/components/layout/app-shell';
import { PageContainer } from '@/src/shared/components/layout/page-container';
import { PageHeader } from '@/src/shared/components/page-header';
import { ProjectsPage } from '@/src/features/projects';
import { getTranslations } from 'next-intl/server';

export default async function ProjectsRoutePage() {
  const t = await getTranslations('projects');
  const tNav = await getTranslations('navigation');

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={t('page_title')}
          description={t('page_desc')}
          breadcrumbs={[
            { label: tNav('home'), href: '/dashboard' },
            { label: tNav('projects') },
          ]}
        />
        <ProjectsPage />
      </PageContainer>
    </AppShell>
  );
}
