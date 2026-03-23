import { ERROR_MESSAGES } from '@/shared/constants/error-messages.constant';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, { message: ERROR_MESSAGES.minLength(2) }),
  email: z.email({ message: ERROR_MESSAGES.invalidEmail }),
  password: z.string().min(6, { message: ERROR_MESSAGES.minPasswordLength(6) }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
