import { HTTP_STATUS, type HttpStatus } from '../constants/http-status.constant';

export class HttpException extends Error {
  readonly statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
