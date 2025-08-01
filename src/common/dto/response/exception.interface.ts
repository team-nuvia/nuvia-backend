import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode, ErrorKey, ErrorMessage, getErrorMessage } from './error-code';

interface IExceptionArgs {
  code?: keyof typeof ErrorCode;
  reason?: StringOrNull;
}

export abstract class BaseException<T extends any = any> extends HttpException implements IBaseResponse<T> {
  @ApiProperty({ description: '성공 여부', example: false })
  ok!: boolean;

  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.BAD_REQUEST,
  })
  httpStatus!: HttpStatus;

  @ApiProperty({
    description: '이름',
    example: '<ResponseDtoName>',
  })
  name!: string;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.BAD_REQUEST,
  })
  message!: string;

  @ApiPropertyNullable({
    description: '이유',
    example: null,
  })
  reason!: StringOrNull;

  @ApiPropertyNullable({
    description: '페이로드',
    example: null,
  })
  payload!: TypeOrNull<T>;

  constructor({ code = ErrorKey.BAD_REQUEST, reason = null }: IExceptionArgs = {}) {
    const { message, status, errorCode } = getErrorMessage(code);

    super({ statusCode: status, message, errorCode }, status);
    this.ok = false;
    this.httpStatus = status;
    this.name = this.constructor.name;
    this.message = message;
    this.reason = reason;
    this.payload = null;
  }
}

/* 400 */
export class BadRequestException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.BAD_REQUEST,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.BAD_REQUEST,
  })
  declare message: string;

  constructor({ code = ErrorKey.BAD_REQUEST, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 401 */
export class UnauthorizedException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.UNAUTHORIZED,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.UNAUTHORIZED,
  })
  declare message: string;

  constructor({ code = ErrorKey.UNAUTHORIZED, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 403 */
export class ForbiddenException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.FORBIDDEN,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.FORBIDDEN,
  })
  declare message: string;

  constructor({ code = ErrorKey.FORBIDDEN, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 404 */
export class NotFoundException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.NOT_FOUND,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.NOT_FOUND,
  })
  declare message: string;

  constructor({ code = ErrorKey.NOT_FOUND, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 405 */
export class MethodNotAllowedException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.METHOD_NOT_ALLOWED,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.METHOD_NOT_ALLOWED,
  })
  declare message: string;
}

/* 409 */
export class ConflictException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.CONFLICT,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.CONFLICT,
  })
  declare message: string;

  constructor({ code = ErrorKey.CONFLICT, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 412 */
export class PreconditionFailedException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.PRECONDITION_FAILED,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.PRECONDITION_FAILED,
  })
  declare message: string;

  constructor({ code = ErrorKey.PRECONDITION_FAILED, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 429 */
export class TooManyRequestsException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.TOO_MANY_REQUESTS,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.TOO_MANY_REQUESTS,
  })
  declare message: string;

  constructor({ code = ErrorKey.TOO_MANY_REQUESTS, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 500 */
export class InternalServerErrorException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.INTERNAL_SERVER_ERROR,
  })
  declare message: string;

  constructor({ code = ErrorKey.INTERNAL_SERVER_ERROR, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 503 */
export class ServiceUnavailableException extends BaseException {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.SERVICE_UNAVAILABLE,
  })
  declare httpStatus: HttpStatus;

  @ApiPropertyNullable({
    description: '메시지',
    example: ErrorMessage.SERVICE_UNAVAILABLE,
  })
  declare message: string;

  constructor({ code = ErrorKey.SERVICE_UNAVAILABLE, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}
