import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    message: string,
    reason?: string,
  ) {
    super(message, status, { cause: reason });
  }
}

/* 400 에러 응답 */
export class BadRequest extends CustomException {
  constructor(message: string, reason?: string) {
    super(HttpStatus.BAD_REQUEST, message, reason);
  }
}

/* 401 에러 응답 */
export class Unauthorized extends CustomException {
  constructor(message: string, reason?: string) {
    super(HttpStatus.UNAUTHORIZED, message, reason);
  }
}

/* 403 에러 응답 */
export class Forbidden extends CustomException {
  constructor(message: string, reason?: string) {
    super(HttpStatus.FORBIDDEN, message, reason);
  }
}

/* 404 에러 응답 */
export class NotFound extends CustomException {
  constructor(message: string, reason?: string) {
    super(HttpStatus.NOT_FOUND, message, reason);
  }
}

/* 409 에러 응답 */
export class Conflict extends CustomException {
  constructor(message: string, reason?: string) {
    super(HttpStatus.CONFLICT, message, reason);
  }
}
