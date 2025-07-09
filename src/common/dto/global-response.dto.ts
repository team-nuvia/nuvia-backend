import { RequestMethod } from '@common/variable/enums';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { isNil } from '@util/isNil';
import { SuccessResponse } from './response/response.interface';

export class CommonResponseDto
  extends SuccessResponse
  implements DefaultResponseData
{
  @ApiProperty({ name: 'ok', type: Boolean, example: true })
  ok!: boolean;

  @ApiProperty({
    name: 'status',
    enum: HttpStatus,
    type: () => HttpStatus,
    example: HttpStatus.OK,
  })
  httpStatus: HttpStatus = HttpStatus.OK;

  @ApiProperty({
    name: 'method',
    enum: RequestMethod,
    type: () => RequestMethod,
    example: RequestMethod.GET,
  })
  method: RequestMethod = RequestMethod.GET;

  @ApiProperty({
    name: 'path',
    type: String,
    example: '/<path>',
  })
  path: string = '/<path>';

  @ApiProperty({
    name: 'timestamp',
    type: Date,
    example: new Date(),
  })
  timestamp: Date = new Date();

  constructor(
    responseData?: Partial<DefaultResponseData>,
    statusCode?: number,
    message?: string,
    cause?: string | null,
  ) {
    super(statusCode ?? HttpStatus.OK, message ?? '응답 완료', cause ?? null);
    this.ok = [HttpStatus.OK, HttpStatus.CREATED].includes(
      responseData?.httpStatus ?? HttpStatus.OK,
    );
    if (!isNil(responseData) && !isNil(responseData.httpStatus))
      this.httpStatus = responseData?.httpStatus ?? HttpStatus.OK;
    if (!isNil(responseData) && !isNil(responseData.method))
      this.method = responseData?.method ?? RequestMethod.GET;
    if (!isNil(responseData) && !isNil(responseData.path))
      this.path = responseData?.path ?? '/<path>';
    this.timestamp = new Date();
  }

  getStatus() {
    return this.httpStatus ?? HttpStatus.BAD_REQUEST;
  }
}

export class SuccessResponseDto<T = any> extends CommonResponseDto {
  @ApiProperty({
    name: 'payload',
    nullable: true,
    required: false,
    example: null,
  })
  payload: T | T[] | null = null;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '<success message>',
    nullable: true,
    required: false,
  })
  declare message: string;

  @ApiProperty({
    name: 'reason',
    type: String,
    example: '<success reason>',
    nullable: true,
    required: false,
  })
  declare reason: string | null;

  constructor(
    {
      payload = null,
      message = '응답 완료',
      reason = null,
    }: ResponseArgs<T> = {
      payload: null,
      message: '응답 완료',
      reason: null,
    },
  ) {
    // const { payload = null, message, reason, ...responseData } = options ?? {};
    super(
      {
        ok: true,
        httpStatus: HttpStatus.OK,
        method: RequestMethod.GET,
        path: '/<path>',
        timestamp: new Date(),
      },
      HttpStatus.OK,
      message,
      reason,
    );
    if (payload) this.payload = payload;
    if (message) this.message = message;
    if (reason) this.reason = reason;
  }
}

export class ErrorResponseDto extends CommonResponseDto {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '<error message>',
    nullable: true,
    required: false,
  })
  declare message: string;

  @ApiProperty({
    name: 'reason',
    type: String,
    example: null,
    nullable: true,
    required: false,
  })
  declare reason: string | null;

  constructor(options?: WithMessageResponseData) {
    const { message = null, reason = null, ...responseData } = options ?? {};
    super(responseData, HttpStatus.BAD_REQUEST, message ?? '응답 완료', reason);
    if (message) this.message = message;
    if (reason) this.reason = reason;
  }
}

// export const FactoryErrorResponseDto = <T extends HttpException>(
//   ResponseDto: T,
//   message: string,
//   detail?: string,
// ) => {
//   class ErrorCommonResponseDto extends ResponseDto {
//     @ApiProperty({
//       name: 'message',
//       type: String,
//       nullable: true,
//       example: message,
//     })
//     message!: string;

//     @ApiProperty({
//       name: 'detail',
//       nullable: true,
//       example: detail ?? '<cause>',
//     })
//     detail!: string | null;

//     constructor({ detail, ...responseData }: WithMessageResponseData) {
//       super(responseData);
//       if (message) this.message = message;
//       if (detail) this.detail = detail;
//     }
//   }
//   return ErrorCommonResponseDto;
// };

/* 400 에러 응답 */
export class BadRequestResponseDto extends ErrorResponseDto {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '잘못된 요청입니다.',
  })
  message: string = '잘못된 요청입니다.';
}

/* 401 에러 응답 */
export class UnauthorizedResponseDto extends ErrorResponseDto {
  httpStatus: HttpStatus = HttpStatus.UNAUTHORIZED;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '인증에 문제가 발생했습니다.',
  })
  message: string = '인증에 문제가 발생했습니다.';
}

/* 403 에러 응답 */
export class ForbiddenResponseDto extends ErrorResponseDto {
  httpStatus: HttpStatus = HttpStatus.FORBIDDEN;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '권한이 없습니다.',
  })
  message: string = '권한이 없습니다.';
}

/* 404 에러 응답 */
export class NotFoundResponseDto extends ErrorResponseDto {
  httpStatus: HttpStatus = HttpStatus.NOT_FOUND;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '리소스를 찾지 못했습니다.',
  })
  message: string = '리소스를 찾지 못했습니다.';
}

/* 409 에러 응답 */
export class ConflictResponseDto extends ErrorResponseDto {
  httpStatus: HttpStatus = HttpStatus.CONFLICT;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '중복된 리소스가 존재합니다.',
  })
  message: string = '중복된 리소스가 존재합니다.';
}

/* 500 에러 응답 */
export class InternalServerErrorResponseDto extends ErrorResponseDto {
  httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '서버 오류가 발생했습니다.',
  })
  message: string = '서버 오류가 발생했습니다.';
}
