'use client';

import React, { useState } from 'react';
import { Project } from '../types/project.types';
import { useDeleteProject } from '../hooks/use-project-mutations';
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

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({ project, open, onOpenChange }: DeleteProjectDialogProps) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const deleteMutation = useDeleteProject();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!project) return;
    setErrorMsg(null);
    try {
      await deleteMutation.mutateAsync(project.id);
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
            {t('delete_dialog_desc', { name: project?.name || '' })}
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
