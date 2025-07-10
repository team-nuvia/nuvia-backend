import { RequestMethod } from '@common/variable/enums';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode, ErrorMessage, getErrorMessage } from './error-code';

export class BaseException extends HttpException implements IResponse {
  @ApiProperty({ name: 'ok', type: Boolean, example: false })
  ok!: boolean;

  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.BAD_REQUEST,
  })
  httpStatus!: HttpStatus;

  @ApiProperty({
    name: 'method',
    enum: RequestMethod,
    example: RequestMethod.GET,
  })
  method!: RequestMethod;

  @ApiProperty({ name: 'path', type: String, example: '/<path>' })
  path!: string;

  @ApiProperty({ name: 'timestamp', type: Date, example: new Date() })
  timestamp!: Date;

  @ApiProperty({
    name: 'payload',
    type: Object,
    example: null,
    required: false,
    nullable: true,
  })
  payload!: null;

  @ApiProperty({
    name: 'name',
    type: String,
    example: '<ResponseDtoName>',
  })
  name!: string;

  @ApiProperty({
    name: 'message',
    type: String,
    example: ErrorMessage.BAD_REQUEST,
    required: false,
    nullable: true,
  })
  message: string;

  @ApiProperty({
    name: 'reason',
    type: String,
    example: null,
    required: false,
    nullable: true,
  })
  reason!: string | null;

  declare cause: string | null;

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    const cause = reason ?? null;
    const { message, status, errorCode } = getErrorMessage(code);

    super({ statusCode: status, message, errorCode }, status);
    this.ok = false;
    this.httpStatus = status;
    this.method = RequestMethod.GET;
    this.path = '/<path>';
    this.timestamp = new Date();
    this.name = this.constructor.name;
    this.payload = null;
    this.message = message;
    this.reason = cause;
    this.cause = cause;
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
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

  constructor(code: keyof typeof ErrorCode, reason: string | null = null) {
    super(code, reason);
  }
}
