import { z } from 'zod';

export const editUserSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t('name_min') })
      .max(100, { message: t('name_max') }),
    email: z
      .string()
      .min(1, { message: t('email_required') })
      .email({ message: t('email_invalid') }),
    job: z.string().max(100, { message: t('job_max') }).optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'MEMBER'], { message: t('role_required') }),
  });

export type EditUserSchemaType = z.infer<ReturnType<typeof editUserSchema>>;
