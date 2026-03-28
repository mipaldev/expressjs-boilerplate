import { ERROR_MESSAGES } from '@/shared/constants/error-messages.constant';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: ERROR_MESSAGES.invalidEmail }),
  password: z.string().min(1, { message: ERROR_MESSAGES.required }),
});

export type LoginInput = z.infer<typeof loginSchema>;
