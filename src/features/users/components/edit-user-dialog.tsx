'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { UserItem } from '../types/user.types';
import { editUserSchema, EditUserSchemaType } from '../schemas/edit-user.schema';
import { useUpdateUser } from '../hooks/use-user-mutations';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
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

interface EditUserDialogProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const updateMutation = useUpdateUser(user?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = editUserSchema(t);

  const form = useForm<EditUserSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      job: '',
      role: 'MEMBER',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        job: user.job || '',
        role: user.role || 'MEMBER',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: EditUserSchemaType) => {
    if (!user) return;
    setErrorMsg(null);
    try {
      await updateMutation.mutateAsync(data);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(errorObj.response?.data?.message || t('edit_error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border">
        <DialogHeader>
          <DialogTitle>{t('edit_dialog_title')}</DialogTitle>
          <DialogDescription>{t('edit_dialog_desc')}</DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('name_label')}</FormLabel>
                  <FormControl>
                    <Input disabled={updateMutation.isPending} {...field} />
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
                    <Input type="email" disabled={updateMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('job_label')}</FormLabel>
                    <FormControl>
                      <Input disabled={updateMutation.isPending} {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={updateMutation.isPending}
                    >
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
                disabled={updateMutation.isPending}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>{tCommon('loading')}</span>
                  </div>
                ) : (
                  <span>{t('edit_submit')}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
