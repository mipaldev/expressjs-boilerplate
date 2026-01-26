import { db } from '@/database/client';
import { users } from '@/database/schemas/user.table';
import type { PagedResult } from '@/shared/types/pagination.type';
import { asc, count, desc, eq, ilike } from 'drizzle-orm';
import type { QueryUserInput } from './schemas/query-user.schema';
import type { UpdateUserInput } from './schemas/update-user.schema';
import type { UserEntity } from './types/user.type';

async function create(
  data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<UserEntity> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

async function findAll(query: QueryUserInput): Promise<PagedResult<UserEntity>> {
  const { page, limit, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  const offset = (page - 1) * limit;

  const whereClause = search ? ilike(users.name, `%${search}%`) : undefined;

  const orderColumn = users[sortBy as keyof typeof users] ?? users.createdAt;
  const orderClause =
    sortOrder === 'asc'
      ? asc(orderColumn as Parameters<typeof asc>[0])
      : desc(orderColumn as Parameters<typeof desc>[0]);

  const [rows, [{ value: total }]] = await Promise.all([
    db.select().from(users).where(whereClause).orderBy(orderClause).limit(limit).offset(offset),
    db.select({ value: count() }).from(users).where(whereClause),
  ]);

  return {
    data: rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function findById(id: UserEntity['id']): Promise<UserEntity | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}

async function findByEmail(email: UserEntity['email']): Promise<UserEntity | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}

async function updateById(id: UserEntity['id'], data: UpdateUserInput): Promise<UserEntity | null> {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user ?? null;
}

async function deleteById(id: UserEntity['id']): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
  return result.length > 0;
}

export const userRepository = {
  create,
  findAll,
  findById,
  findByEmail,
  updateById,
  deleteById,
};
