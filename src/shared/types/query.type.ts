export type SortOrder = 'asc' | 'desc';

export type PaginationQuery<TFilters = Record<string, unknown>> = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
} & TFilters;
