import { createUserSchema } from '@/module/user/schemas/create-user.schema';
import z from 'zod';

export const registerSchema = createUserSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
