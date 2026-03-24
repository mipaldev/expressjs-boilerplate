import { ERROR_MESSAGES } from '@/shared/constants/error-messages.constant';
import { baseQuerySchema } from '@/shared/schemas/base-query.schema';
import { z } from 'zod';

export const allowedFields = ['name', 'email', 'createdAt'] as const;

export const queryUserSchema = baseQuerySchema.omit({ sortBy: true }).extend({
  sortBy: z
    .enum(allowedFields, {
      message: ERROR_MESSAGES.invalidEnum(allowedFields),
    })
    .optional(),
});

export type QueryUserInput = z.infer<typeof queryUserSchema>;
