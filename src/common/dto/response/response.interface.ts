import { RequestMethod } from '@common/variable/enums';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseException
  extends HttpException
  implements WithMessageCommonResponseData<any>
{
  @ApiProperty({ name: 'ok', type: Boolean, example: false })
  ok!: boolean;

  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    example: HttpStatus.OK,
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
    example: '잘못된 요청입니다.',
    required: false,
    nullable: true,
  })
  message!: string;

  @ApiProperty({
    name: 'reason',
    type: String,
    example: null,
    required: false,
    nullable: true,
  })
  reason!: string | null;

  declare cause: string | null;

  constructor(
    statusCode: number = HttpStatus.BAD_REQUEST,
    errorMessage: string,
    cause: string | null = null,
  ) {
    super({ statusCode, errorMessage }, statusCode);
    this.ok = false;
    this.httpStatus = statusCode;
    this.method = RequestMethod.GET;
    this.path = '/<path>';
    this.timestamp = new Date();
    this.name = this.constructor.name;
    this.payload = null;
    this.message = errorMessage ?? null;
    this.reason = cause ?? null;
    this.cause = cause ?? null;
  }
}

export class SuccessResponse<T = any>
  implements WithMessageCommonResponseData<T>
{
  @ApiProperty({ name: 'ok', type: Boolean, example: true })
  ok!: boolean;

  @ApiProperty({
    name: 'httpStatus',
    enum: HttpStatus,
    type: () => HttpStatus,
    example: HttpStatus.OK,
  })
  httpStatus!: HttpStatus;

  @ApiProperty({
    name: 'method',
    enum: RequestMethod,
    type: () => RequestMethod,
    example: RequestMethod.GET,
  })
  method!: RequestMethod;

  @ApiProperty({
    name: 'path',
    type: String,
    example: '/<path>',
  })
  path!: string;

  @ApiProperty({
    name: 'timestamp',
    type: Date,
    example: new Date(),
  })
  timestamp!: Date;

  /* 응답 객체별 ApiProperty 재정의 */
  @ApiProperty({
    name: 'payload',
    example: null,
    required: false,
    nullable: true,
  })
  payload!: T | T[] | null;

  @ApiProperty({
    name: 'name',
    type: String,
    example: '<ResponseDtoName>',
    required: false,
    nullable: true,
  })
  name!: string;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '성공',
    required: false,
    nullable: true,
  })
  message!: string | null;

  @ApiProperty({
    name: 'reason',
    type: String,
    example: null,
    required: false,
    nullable: true,
  })
  reason!: string | null;

  constructor(
    payload: T | T[] | null,
    message: string,
    reason: string | null = null,
  ) {
    if (payload !== undefined) this.payload = payload;
    if (message !== undefined) this.message = message;
    if (reason !== undefined) this.reason = reason;
  }
}

// /* 200 OK */
// export class SuccessResponse extends BaseException {
//   constructor(
//     errorCode: string | number,
//     errorMessage: string,
//     cause: string | null = null,
//   ) {
//     super(errorCode, errorMessage, HttpStatus.OK, cause);
//   }
// }

// /* 201 Created */
// export class CreatedResponse extends BaseException {
//   constructor(
//     errorCode: string | number,
//     errorMessage: string,
//     cause: string | null = null,
//   ) {
//     super(errorCode, errorMessage, HttpStatus.CREATED, cause);
//   }
// }

// /* 204 No Content */
// export class NoContentResponse extends BaseException {
//   constructor(
//     errorCode: string | number,
//     errorMessage: string,
//     cause: string | null = null,
//   ) {
//     super(errorCode, errorMessage, HttpStatus.NO_CONTENT, cause);
//   }
// }

/* 400 Bad Request */
export class BadRequestException extends BaseException {
  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.BAD_REQUEST, errorMessage, cause);
  }
}

/* 401 Unauthorized */
export class UnauthorizedException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '인증에 문제가 발생했습니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.UNAUTHORIZED, errorMessage, cause);
    this.message = '인증에 문제가 발생했습니다.';
  }
}

/* 403 Forbidden */
export class ForbiddenException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '권한이 없습니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.FORBIDDEN, errorMessage, cause);
  }
}

/* 404 Not Found */
export class NotFoundException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '리소스를 찾지 못했습니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.NOT_FOUND, errorMessage, cause);
  }
}

/* 405 Method Not Allowed */
export class MethodNotAllowedException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '메서드가 허용되지 않습니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.METHOD_NOT_ALLOWED, errorMessage, cause);
  }
}

/* 406 Not Acceptable */
export class NotAcceptableException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '허용되지 않는 미디어 타입입니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.NOT_ACCEPTABLE, errorMessage, cause);
  }
}

/* 409 Conflict */
export class ConflictException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '중복된 리소스가 존재합니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.CONFLICT, errorMessage, cause);
  }
}

/* 500 Internal Server Error */
export class InternalServerErrorException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '서버 오류가 발생했습니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage, cause);
  }
}

/* 503 Service Unavailable */
export class ServiceUnavailableException extends BaseException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '서비스를 사용할 수 없습니다.',
  })
  declare message: string;

  constructor(errorMessage: string, cause: string | null = null) {
    super(HttpStatus.SERVICE_UNAVAILABLE, errorMessage, cause);
  }
}
