'use client';

import React, { useState } from 'react';
import { Task } from '../types/task.types';
import { useDeleteTask } from '../hooks/use-task-mutations';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/src/shared/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/src/shared/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DeleteTaskDialogProps {
  projectId: string;
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({ projectId, task, open, onOpenChange }: DeleteTaskDialogProps) {
  const t = useTranslations('tasks');
  const tCommon = useTranslations('common');
  const deleteMutation = useDeleteTask(projectId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!task) return;
    setErrorMsg(null);
    try {
      await deleteMutation.mutateAsync(task.id);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(errorObj.response?.data?.message || t('delete_error'));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('delete_dialog_title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('delete_dialog_desc', { title: task?.title || '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMsg && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            {tCommon('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
          >
            {deleteMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>{tCommon('loading')}</span>
              </div>
            ) : (
              <span>{tCommon('delete')}</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
