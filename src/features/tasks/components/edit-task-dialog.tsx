'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Task } from '../types/task.types';
import { editTaskSchema, EditTaskSchemaType } from '../schemas/edit-task.schema';
import { useUpdateTaskMutation } from '../hooks/use-task-mutations';
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

interface EditTaskDialogProps {
  projectId: string;
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({ projectId, task, open, onOpenChange }: EditTaskDialogProps) {
  const t = useTranslations('tasks');
  const tStatus = useTranslations('status');
  const tPriority = useTranslations('priority');
  const tCommon = useTranslations('common');

  // Source assignees from project members only — backend enforces this
  const { data: members = [], isSuccess: membersLoaded } = useProjectMembers(projectId);
  const updateMutation = useUpdateTaskMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = editTaskSchema(t);

  const form = useForm<EditTaskSchemaType>({
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

  // Wait until members are loaded before resetting so MemberSelect
  // can resolve the assignee name from the UUID immediately
  useEffect(() => {
    if (task && open && membersLoaded) {
      form.reset({
        title: task.title || '',
        description: task.description || '',
        status: (task.status as EditTaskSchemaType['status']) || 'TODO',
        priority: (task.priority as EditTaskSchemaType['priority']) || 'MEDIUM',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assigneeId: task.assigneeId || task.assignee?.id || '',
      });
    }
  }, [task, open, membersLoaded, form]);

  const onSubmit = async (data: EditTaskSchemaType) => {
    if (!task?.id) return;
    setErrorMsg(null);
    const payload = {
      ...data,
      assigneeId: data.assigneeId === UNASSIGNED_MEMBER ? '' : (data.assigneeId ?? ''),
    };
    try {
      await updateMutation.mutateAsync({ id: task.id, data: payload });
      onOpenChange(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message || t('edit_error'));
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-1">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('title_label')}</FormLabel>
                  <FormControl>
                    <Input disabled={updateMutation.isPending} {...field} />
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
                    <Textarea rows={3} disabled={updateMutation.isPending} {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={updateMutation.isPending}>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={updateMutation.isPending}>
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
                        disabled={updateMutation.isPending}
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
                      <Input type="date" disabled={updateMutation.isPending} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateMutation.isPending}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <div className="flex items-center gap-2"><Spinner className="h-4 w-4" /><span>{tCommon('loading')}</span></div>
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
