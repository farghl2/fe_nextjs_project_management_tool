'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Project } from '../types/project.types';
import { editProjectSchema, EditProjectSchemaType } from '../schemas/edit-project.schema';
import { useUpdateProject } from '../hooks/use-project-mutations';
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

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectDialog({ project, open, onOpenChange }: EditProjectDialogProps) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const updateMutation = useUpdateProject(project?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = editProjectSchema(t);

  const form = useForm<EditProjectSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'ACTIVE',
      });
    }
  }, [project, form]);

  const onSubmit = async (data: EditProjectSchemaType) => {
    if (!project) return;
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('status_label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'ACTIVE'}
                    disabled={updateMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder={t('select_status')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">{t('status_active')}</SelectItem>
                      <SelectItem value="COMPLETED">{t('status_completed')}</SelectItem>
                      <SelectItem value="ARCHIVED">{t('status_archived')}</SelectItem>
                    </SelectContent>
                  </Select>
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
