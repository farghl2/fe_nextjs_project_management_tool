import React from 'react';
import { LoginForm, LoginHero } from '@/src/features/auth';
import { GuestGuard } from '@/src/shared/components/guards';

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
        <LoginHero />
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  );
}
