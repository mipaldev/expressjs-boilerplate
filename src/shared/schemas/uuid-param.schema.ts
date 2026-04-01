import { ERROR_MESSAGES } from '@/shared/constants/error-messages.constant';
import { z } from 'zod';

export const uuidParamSchema = z.object({
  id: z.uuid({ message: ERROR_MESSAGES.invalidUuid }),
});
