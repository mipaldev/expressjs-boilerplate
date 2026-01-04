import { timestampUtil } from '@/shared/utils/timestamp.util';
import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),

  ...timestampUtil.timestamps(),
});
