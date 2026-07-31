import { z } from 'zod';

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('email_required') })
      .email({ message: t('email_invalid') }),
    password: z
      .string()
      .min(6, { message: t('password_min') })
      .max(100, { message: t('password_max') }),
  });

export type LoginSchemaType = z.infer<ReturnType<typeof createLoginSchema>>;
