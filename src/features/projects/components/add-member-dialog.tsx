'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { addMemberSchema, AddMemberSchemaType } from '../schemas/add-member.schema';
import { useAddProjectMember } from '../hooks/use-project-mutations';
import { AssigneeSelect, UNASSIGNED } from '@/src/shared/components/assignee-select';
import { Button } from '@/src/shared/components/ui/button';
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

interface AddMemberDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberDialog({ projectId, open, onOpenChange }: AddMemberDialogProps) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const addMutation = useAddProjectMember(projectId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const schema = addMemberSchema(t);

  const form = useForm<AddMemberSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { userId: '' },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setErrorMsg(null);
    }
    onOpenChange(isOpen);
  };

  const onSubmit = async (data: AddMemberSchemaType) => {
    setErrorMsg(null);
    try {
      // Only send userId — backend does not accept role
      await addMutation.mutateAsync({ userId: data.userId });
      form.reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(errorObj.response?.data?.message || t('add_member_error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-border">
        <DialogHeader>
          <DialogTitle>{t('add_member_title')}</DialogTitle>
          <DialogDescription>{t('add_member_desc')}</DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* User picker — infinite scroll dropdown */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">{t('user_id_label')}</FormLabel>
                  <FormControl>
                    <AssigneeSelect
                      value={field.value || UNASSIGNED}
                      onChange={(val) => field.onChange(val === UNASSIGNED ? '' : val)}
                      disabled={addMutation.isPending}
                      placeholder={t('user_id_placeholder')}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={addMutation.isPending}
              >
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>{tCommon('loading')}</span>
                  </div>
                ) : (
                  <span>{t('add_member_submit')}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
