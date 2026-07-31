import React from 'react';
import { AppShell } from '@/src/shared/components/layout/app-shell';
import { PageContainer } from '@/src/shared/components/layout/page-container';
import { PageHeader } from '@/src/shared/components/page-header';
import { ProjectDetails } from '@/src/features/projects';
import { getTranslations } from 'next-intl/server';

export default async function ProjectDetailsRoutePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const t = await getTranslations('projects');
  const tNav = await getTranslations('navigation');

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={t('project_details_title')}
          description={t('project_details_desc')}
          breadcrumbs={[
            { label: tNav('home'), href: '/dashboard' },
            { label: tNav('projects'), href: '/projects' },
            { label: t('details_breadcrumb') },
          ]}
        />
        <ProjectDetails projectId={projectId} />
      </PageContainer>
    </AppShell>
  );
}
