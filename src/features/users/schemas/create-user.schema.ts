import { z } from 'zod';

export const createUserSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(2, { message: t('name_min') })
        .max(100, { message: t('name_max') }),
      email: z
        .string()
        .min(1, { message: t('email_required') })
        .email({ message: t('email_invalid') }),
      password: z
        .string()
        .min(6, { message: t('password_min') })
        .max(100, { message: t('password_max') }),
      confirmPassword: z.string().min(1, { message: t('confirm_password_required') }),
      job: z.string().max(100, { message: t('job_max') }).optional().or(z.literal('')),
      role: z.enum(['ADMIN', 'MEMBER'], { message: t('role_required') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwords_mismatch'),
      path: ['confirmPassword'],
    });

export type CreateUserSchemaType = z.infer<ReturnType<typeof createUserSchema>>;
