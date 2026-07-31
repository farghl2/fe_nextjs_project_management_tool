'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { updateProfileSchema, UpdateProfileSchemaType } from '../schemas/profile.schema';
import { useUpdateProfile } from '../hooks/use-profile';
import { Button } from '@/src/shared/components/ui/button';
import { Input } from '@/src/shared/components/ui/input';
import { Textarea } from '@/src/shared/components/ui/textarea';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/components/ui/form';
import { Alert, AlertDescription } from '@/src/shared/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { User } from '@/src/shared/types/api.types';

interface EditProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const updateMutation = useUpdateProfile(user?.id);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = updateProfileSchema(t);

  const form = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      job: '',
      description: '',
      image: '',
    },
  });

  useEffect(() => {
    if (user && open) {
      setErrorMsg(null);
      form.reset({
        name: user.name || '',
        phone: user.phone || '',
        job: user.job || '',
        description: user.description || '',
        image: user.avatar || user.image || '',
      });
    }
  }, [user, open, form]);

  const onSubmit = async (data: UpdateProfileSchemaType) => {
    setErrorMsg(null);
    try {
      await updateMutation.mutateAsync(data);
      onOpenChange(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message || t('update_error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border">
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
            {/* Name */}
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

            {/* Phone + Job Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('phone_label')}</FormLabel>
                    <FormControl>
                      <Input disabled={updateMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

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
            </div>

            {/* Image URL */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('image_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." disabled={updateMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Description / Bio */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('description_label')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} disabled={updateMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

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
                  <span>{t('save_changes')}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
