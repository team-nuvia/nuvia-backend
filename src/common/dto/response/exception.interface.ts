import { SetPropertyNullable } from '@common/decorator/set-property-nullable.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode, ErrorKey, ErrorMessage, getErrorMessage } from './error-code';

interface IExceptionArgs {
  code?: keyof typeof ErrorCode;
  reason?: StringOrNull;
}

export abstract class BaseException<T extends any = any> extends HttpException implements IBaseResponse<T> {
  @ApiProperty({ name: 'ok', type: Boolean, example: false })
  ok!: boolean;

  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.BAD_REQUEST,
  })
  httpStatus!: HttpStatus;

  @ApiProperty({
    name: 'name',
    type: String,
    example: '<ResponseDtoName>',
  })
  name!: string;

  @SetPropertyNullable({
    description: '메시지',
    value: ErrorMessage.BAD_REQUEST,
  })
  message!: string;

  @SetPropertyNullable({
    description: '이유',
    value: null,
  })
  reason!: StringOrNull;

  @SetPropertyNullable({
    description: '페이로드',
    value: null,
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
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.BAD_REQUEST,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.BAD_REQUEST,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.BAD_REQUEST, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 401 */
export class UnauthorizedException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.UNAUTHORIZED,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.UNAUTHORIZED,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.UNAUTHORIZED, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 403 */
export class ForbiddenException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.FORBIDDEN,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.FORBIDDEN,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.FORBIDDEN, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 404 */
export class NotFoundException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.NOT_FOUND,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.NOT_FOUND,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.NOT_FOUND, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 409 */
export class ConflictException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.CONFLICT,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.CONFLICT,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.CONFLICT, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 412 */
export class PreconditionFailedException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.PRECONDITION_FAILED,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.PRECONDITION_FAILED,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.PRECONDITION_FAILED, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 429 */
export class TooManyRequestsException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.TOO_MANY_REQUESTS,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.TOO_MANY_REQUESTS,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.TOO_MANY_REQUESTS, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 500 */
export class InternalServerErrorException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.INTERNAL_SERVER_ERROR,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.INTERNAL_SERVER_ERROR, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}

/* 503 */
export class ServiceUnavailableException extends BaseException {
  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.SERVICE_UNAVAILABLE,
  })
  declare httpStatus: HttpStatus;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.SERVICE_UNAVAILABLE,
    required: false,
    nullable: true,
  })
  declare message: string;

  constructor({ code = ErrorKey.SERVICE_UNAVAILABLE, reason = null }: IExceptionArgs = {}) {
    super({ code, reason });
  }
}
