import { HTTP_STATUS } from '../constants/http-status.constant';
import { httpStatusUtil } from '../utils/http-status.util';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message = httpStatusUtil.statusText(HTTP_STATUS.NOT_FOUND)) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
