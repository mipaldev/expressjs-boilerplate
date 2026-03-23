import { ERROR_MESSAGES } from '@/shared/constants/error-messages.constant';
import { baseQuerySchema } from '@/shared/schemas/base-query.schema';
import { z } from 'zod';

export const queryUserSchema = baseQuerySchema.extend({
  sortBy: z
    .enum(['name', 'email', 'createdAt'], {
      message: ERROR_MESSAGES.invalidEnum(['name', 'email', 'createdAt']),
    })
    .optional(),
});

export type QueryUserInput = z.infer<typeof queryUserSchema>;
