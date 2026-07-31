import { z } from 'zod';

export const editProjectSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t('name_min') })
      .max(100, { message: t('name_max') }),
    description: z
      .string()
      .max(500, { message: t('description_max') })
      .optional()
      .or(z.literal('')),
    status: z.string().optional(),
  });

export type EditProjectSchemaType = z.infer<ReturnType<typeof editProjectSchema>>;
