import type { Response } from 'express';
import type { HttpStatus } from '@/shared/constants/http-status.constant';
import type {
  ApiErrorResponse,
  ApiResponse,
  PaginatedApiResponse,
} from '@/shared/types/http-response.type';
import type { PaginationMeta } from '@/shared/types/pagination.type';

function success<T>({
  res,
  data,
  statusCode,
  message,
}: {
  res: Response;
  data: T;
  statusCode: HttpStatus;
  message?: string;
}): void {
  const body: ApiResponse<T> = { success: true, statusCode, message, data };
  res.status(statusCode).json(body);
}

function paginated<T>({
  res,
  data,
  meta,
  statusCode,
  message,
}: {
  res: Response;
  data: T[];
  meta: PaginationMeta;
  statusCode: HttpStatus;
  message?: string;
}): void {
  const body: PaginatedApiResponse<T> = { success: true, statusCode, message, data, meta };
  res.status(statusCode).json(body);
}

function error({
  res,
  statusCode,
  message,
  errors,
}: {
  res: Response;
  statusCode: HttpStatus;
  message: string;
  errors?: Record<string, string | string[]>;
}): void {
  const body: ApiErrorResponse = {
    success: false,
    statusCode,
    message,
    ...(errors ? { errors } : {}),
  };

  res.status(statusCode).json(body);
}
export const httpResponseUtil = {
  success,
  paginated,
  error,
};
