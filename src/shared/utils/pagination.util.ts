import type { PagedResult, PaginationMeta } from '@/shared/types/pagination.type';

function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

function calcOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

async function paginate<T>(
  dataQuery: Promise<T[]>,
  countQuery: Promise<{ value: number }[]>,
  page: number,
  limit: number,
): Promise<PagedResult<T>> {
  const [rows, [{ value: total }]] = await Promise.all([dataQuery, countQuery]);
  return {
    data: rows,
    meta: buildMeta(total, page, limit),
  };
}

export const paginationUtil = {
  calcOffset,
  buildMeta,
  paginate,
};
