'use client';

import React from 'react';
import { Kanban, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LoginHero() {
  const t = useTranslations('auth');

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 bg-sidebar border-e border-sidebar-border overflow-hidden select-none">
      {/* Background Decorative Gradients using CSS variables */}
      <div className="absolute top-0 start-0 -translate-x-12 -translate-y-12 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-0 translate-x-12 translate-y-12 w-96 h-96 rounded-full bg-info/10 blur-3xl pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
          <Kanban className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-sidebar-foreground">Done</span>
          <span className="block text-xs font-medium text-muted-foreground">Workspace Platform</span>
        </div>
      </div>

      {/* Center Value Proposition */}
      <div className="relative z-10 my-auto max-w-lg space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sidebar-primary/10 text-sidebar-primary text-xs font-semibold border border-sidebar-primary/20">
          <Zap className="h-3.5 w-3.5" />
          <span>{t('hero_badge')}</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-sidebar-foreground sm:text-4xl leading-tight">
          {t('hero_title')}
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('hero_subtitle')}
        </p>

        {/* Feature List */}
        <div className="space-y-3 pt-2">
          {[
            t('hero_feature_1'),
            t('hero_feature_2'),
            t('hero_feature_3'),
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs font-medium text-sidebar-foreground/90">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground pt-6 border-t border-sidebar-border/40">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>{t('hero_security_note')}</span>
      </div>
    </div>
  );
}
