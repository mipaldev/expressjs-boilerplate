import { HTTP_STATUS } from '../constants/http-status.constant';
import { httpStatusUtil } from '../utils/http-status.util';
import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor(message = httpStatusUtil.statusText(HTTP_STATUS.UNAUTHORIZED)) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
