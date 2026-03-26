import type { PaginationMeta } from '@/shared/types/pagination.type';

function calcOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export const paginationUtil = {
  calcOffset,
  buildMeta,
};
