import type { PagedResult } from './pagination.type';

export type ApiResponse<T> = {
  success: true;
  statusCode: number;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
};

export type PaginatedApiResponse<T> = PagedResult<T> & {
  success: true;
  statusCode: number;
  message?: string;
};
