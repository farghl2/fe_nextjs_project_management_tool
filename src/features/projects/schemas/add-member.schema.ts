import { z } from 'zod';

export const addMemberSchema = (t: (key: string) => string) =>
  z.object({
    userId: z.string().min(1, { message: t('user_required') }),
  });

export type AddMemberSchemaType = z.infer<ReturnType<typeof addMemberSchema>>;
