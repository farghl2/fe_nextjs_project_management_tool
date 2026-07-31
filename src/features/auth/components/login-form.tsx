'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/src/i18n/routing';
import { createLoginSchema, LoginSchemaType } from '../schemas/login.schema';
import { useLogin } from '../hooks/use-auth-query';
import { getApiErrorMessage } from '@/src/shared/types/api.types';
import { PasswordInput } from './password-input';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { Spinner } from '@/src/shared/components/ui/spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form';
import { Alert, AlertDescription } from '@/src/shared/components/ui/alert';
import { AlertCircle, Languages, Kanban } from 'lucide-react';

export function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const loginMutation = useLogin();

  const loginSchema = createLoginSchema(t);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const serverError = loginMutation.error
    ? getApiErrorMessage(loginMutation.error, t('invalid_credentials'))
    : null;

  const onSubmit = (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Top Mobile Header & Language Switcher */}
      <div className="flex items-center justify-between">
        <div className="lg:hidden flex items-center gap-2 font-bold text-lg text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <Kanban className="h-4 w-4" />
          </div>
          <span>Done</span>
        </div>
        <div className="ms-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 gap-1.5 px-2.5 text-xs font-medium border-border/60"
          >
            <Languages className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="uppercase">{locale === 'ar' ? 'English' : 'عربي'}</span>
          </Button>
        </div>
      </div>

      {/* Title Header */}
      <div className="space-y-2 text-start">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t('login_title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('login_subtitle')}</p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-medium">{serverError}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">{t('email_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-medium">{t('password_label')}</FormLabel>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-10 font-semibold shadow-sm transition-all"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>{t('signing_in')}</span>
              </div>
            ) : (
              <span>{t('submit_button')}</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
