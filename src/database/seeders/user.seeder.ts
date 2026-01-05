import { eq } from 'drizzle-orm';
import { db } from '../client';
import { loggerUtil } from '@/shared/utils/logger.util';
import { passwordUtil } from '@/shared/utils/password.util';
import { users } from '../schemas/user.table';

export async function userSeeder() {
  // await db.delete(users);

  const existing = await db.select().from(users).where(eq(users.email, 'pepet@example.com'));

  if (existing.length > 0) {
    loggerUtil.warn('[User Seeder] User already exists.');
    return;
  }

  await db.insert(users).values({
    name: 'Muhammad Patrick',
    email: 'pepet@example.com',
    password: await passwordUtil.hash('P@ssw0rd'),
  });

  loggerUtil.info('[User Seeder] User seeded successfully.');
}
