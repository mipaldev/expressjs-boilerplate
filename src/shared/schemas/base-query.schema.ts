import { z } from 'zod';
import { ERROR_MESSAGES } from '@/shared/constants/error-messages.constant';

export const baseQuerySchema = z.object({
  page: z.coerce
    .number({ message: ERROR_MESSAGES.invalidType })
    .positive({ message: ERROR_MESSAGES.positiveNumber })
    .default(1),

  limit: z.coerce
    .number({ message: ERROR_MESSAGES.invalidType })
    .positive({ message: ERROR_MESSAGES.positiveNumber })
    .max(100, {
      message: ERROR_MESSAGES.maxValue(100),
    })
    .default(10),

  search: z.string({ message: ERROR_MESSAGES.invalidType }).optional(),

  sortBy: z.string({ message: ERROR_MESSAGES.invalidType }).optional(),

  sortOrder: z
    .enum(['asc', 'desc'], {
      message: ERROR_MESSAGES.invalidEnum(['asc', 'desc']),
    })
    .optional(),
});
