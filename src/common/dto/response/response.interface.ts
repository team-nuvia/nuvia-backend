import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  name!: string;

  message!: string;

  declare cause: string | null;

  constructor(
    errorCode: string | number,
    errorMessage: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    cause: string | null = null,
  ) {
    super({ errorCode, errorMessage, statusCode }, statusCode);
    this.name = this.constructor.name;
    this.message = errorMessage;
    this.cause = cause;
  }
}

/* 200 OK */
export class SuccessResponse extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.OK, cause);
  }
}

/* 201 Created */
export class CreatedResponse extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.CREATED, cause);
  }
}

/* 204 No Content */
export class NoContentResponse extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.NO_CONTENT, cause);
  }
}

/* 400 Bad Request */
export class BadRequestException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.BAD_REQUEST, cause);
  }
}

/* 401 Unauthorized */
export class UnauthorizedException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.UNAUTHORIZED, cause);
  }
}

/* 403 Forbidden */
export class ForbiddenException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.FORBIDDEN, cause);
  }
}

/* 404 Not Found */
export class NotFoundException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.NOT_FOUND, cause);
  }
}

/* 405 Method Not Allowed */
export class MethodNotAllowedException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.METHOD_NOT_ALLOWED, cause);
  }
}

/* 406 Not Acceptable */
export class NotAcceptableException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.NOT_ACCEPTABLE, cause);
  }
}

/* 409 Conflict */
export class ConflictException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.CONFLICT, cause);
  }
}

/* 500 Internal Server Error */
export class InternalServerErrorException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.INTERNAL_SERVER_ERROR, cause);
  }
}

/* 503 Service Unavailable */
export class ServiceUnavailableException extends BaseException {
  constructor(
    errorCode: string | number,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super(errorCode, errorMessage, HttpStatus.SERVICE_UNAVAILABLE, cause);
  }
}
