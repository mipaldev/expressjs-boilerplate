import { users } from '@/database/schemas/user.table';

export type UserEntity = typeof users.$inferSelect;
