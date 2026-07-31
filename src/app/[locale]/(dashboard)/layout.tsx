import React from 'react';
import { AuthGuard } from '@/src/shared/components/guards';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
