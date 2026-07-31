import { z } from 'zod';

export const editTaskSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(2, { message: t('title_min') })
      .max(150, { message: t('title_max') }),
    description: z.string().max(1000, { message: t('description_max') }).optional().or(z.literal('')),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'], { message: t('status_required') }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], { message: t('priority_required') }),
    dueDate: z.string().optional().or(z.literal('')),
    assigneeId: z.string().optional().or(z.literal('')),
  });

export type EditTaskSchemaType = z.infer<ReturnType<typeof editTaskSchema>>;
