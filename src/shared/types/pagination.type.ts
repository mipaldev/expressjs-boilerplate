export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PagedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
