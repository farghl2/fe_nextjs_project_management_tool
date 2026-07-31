import { z } from 'zod';

export const updateProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t('name_min') || 'Name must be at least 2 characters' })
      .max(100, { message: t('name_max') || 'Name must not exceed 100 characters' }),
    phone: z.string().optional(),
    job: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  });

export type UpdateProfileSchemaType = z.infer<ReturnType<typeof updateProfileSchema>>;
