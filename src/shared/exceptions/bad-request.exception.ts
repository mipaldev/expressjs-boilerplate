import { HTTP_STATUS } from '../constants/http-status.constant';
import { httpStatusUtil } from '../utils/http-status.util';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message = httpStatusUtil.statusText(HTTP_STATUS.BAD_REQUEST)) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}
