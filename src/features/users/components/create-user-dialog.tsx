'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createUserSchema, CreateUserSchemaType } from '../schemas/create-user.schema';
import { useCreateUser } from '../hooks/use-user-mutations';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { PasswordInput } from '@/src/features/auth/components/password-input';
import { Spinner } from '@/src/shared/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form';
import { Alert, AlertDescription } from '@/src/shared/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const createMutation = useCreateUser();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = createUserSchema(t);

  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      job: '',
      role: 'MEMBER',
    },
  });

  const onSubmit = async (data: CreateUserSchemaType) => {
    setErrorMsg(null);
    const { confirmPassword, ...payload } = data;
    try {
      await createMutation.mutateAsync(payload);
      form.reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(errorObj.response?.data?.message || t('create_error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border">
        <DialogHeader>
          <DialogTitle>{t('create_dialog_title')}</DialogTitle>
          <DialogDescription>{t('create_dialog_desc')}</DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('name_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('name_placeholder')} disabled={createMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('email_label')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('email_placeholder')} disabled={createMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('password_label')}</FormLabel>
                    <FormControl>
                      <PasswordInput disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('confirm_password_label')}</FormLabel>
                    <FormControl>
                      <PasswordInput disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('job_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('job_placeholder')} disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('role_label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={createMutation.isPending}>
                      <FormControl>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder={t('select_role')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>{tCommon('loading')}</span>
                  </div>
                ) : (
                  <span>{t('create_submit')}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
