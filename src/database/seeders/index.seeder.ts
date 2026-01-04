import { loggerUtil } from '@/shared/utils/logger.util';
import { userSeeder } from './user.seeder';

async function seedDatabase() {
  loggerUtil.info('[Seeder] Starting database seeding...');

  await userSeeder();
}

seedDatabase()
  .then(() => {
    loggerUtil.info('[Seeder] Database seeding completed successfully.');
  })
  .catch(() => {
    loggerUtil.error('[Seeder] Database seeding failed');
  });
