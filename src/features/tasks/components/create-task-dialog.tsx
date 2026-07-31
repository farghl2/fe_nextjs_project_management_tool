'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createTaskSchema, CreateTaskSchemaType } from '../schemas/create-task.schema';
import { useCreateTask } from '../hooks/use-task-mutations';
import { useProjectMembers } from '@/src/features/projects/hooks/use-project-members';
import { MemberSelect, UNASSIGNED_MEMBER } from '@/src/shared/components/member-select';
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

interface CreateTaskDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ projectId, open, onOpenChange }: CreateTaskDialogProps) {
  const t = useTranslations('tasks');
  const tStatus = useTranslations('status');
  const tPriority = useTranslations('priority');
  const tCommon = useTranslations('common');

  // Source assignees from project members safely
  const { data: members = [] } = useProjectMembers(projectId);
  const createMutation = useCreateTask(projectId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = createTaskSchema(t);

  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      assigneeId: '',
    },
  });

  useEffect(() => {
    if (open) {
      setErrorMsg(null);
      form.reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        assigneeId: '',
      });
    }
  }, [open, form]);

  const onSubmit = async (data: CreateTaskSchemaType) => {
    setErrorMsg(null);
    const payload = {
      ...data,
      assigneeId: data.assigneeId === UNASSIGNED_MEMBER ? '' : (data.assigneeId ?? ''),
    };
    try {
      await createMutation.mutateAsync(payload);
      form.reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message || t('create_error'));
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
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('title_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('title_placeholder')} disabled={createMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('description_label')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={t('description_placeholder')} disabled={createMutation.isPending} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Status + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('status_label')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'TODO'} disabled={createMutation.isPending}>
                      <FormControl>
                        <SelectTrigger className="text-xs"><SelectValue placeholder={t('select_status')} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TODO">{tStatus('todo')}</SelectItem>
                        <SelectItem value="IN_PROGRESS">{tStatus('in_progress')}</SelectItem>
                        <SelectItem value="IN_REVIEW">{tStatus('in_review')}</SelectItem>
                        <SelectItem value="DONE">{tStatus('completed')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('priority_label')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'MEDIUM'} disabled={createMutation.isPending}>
                      <FormControl>
                        <SelectTrigger className="text-xs"><SelectValue placeholder={t('select_priority')} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">{tPriority('low')}</SelectItem>
                        <SelectItem value="MEDIUM">{tPriority('medium')}</SelectItem>
                        <SelectItem value="HIGH">{tPriority('high')}</SelectItem>
                        <SelectItem value="URGENT">{tPriority('urgent')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Assignee (project members only) + Due date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('assignee_label')}</FormLabel>
                    <FormControl>
                      <MemberSelect
                        value={field.value || UNASSIGNED_MEMBER}
                        onChange={field.onChange}
                        members={members}
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">{t('due_date_label')}</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={createMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createMutation.isPending}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <div className="flex items-center gap-2"><Spinner className="h-4 w-4" /><span>{tCommon('loading')}</span></div>
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
