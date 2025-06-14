import { RequestMethod } from '@common/variable/enums';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { isNil } from '@util/isNil';

export class CommonResponseDto {
  @ApiProperty({ name: 'ok', type: Boolean, example: true })
  ok!: boolean;

  @ApiProperty({
    name: 'status',
    enum: HttpStatus,
    type: () => HttpStatus,
    example: HttpStatus.OK,
  })
  status: HttpStatus = HttpStatus.OK;

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

  constructor(responseData: DefaultResponseData) {
    this.ok = [HttpStatus.OK, HttpStatus.CREATED].includes(
      responseData.status ?? HttpStatus.OK,
    );
    if (!isNil(responseData) && !isNil(responseData.status))
      this.status = responseData.status;
    if (!isNil(responseData) && !isNil(responseData.method))
      this.method = responseData.method;
    if (!isNil(responseData) && !isNil(responseData.path))
      this.path = responseData.path;
    this.timestamp = new Date();
  }

  getStatus() {
    return this.status ?? HttpStatus.BAD_REQUEST;
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
  message?: string | null = '<success message>';

  constructor(options: WithMessageCommonResponseData<T>) {
    const { payload = null, message = null, ...responseData } = options ?? {};
    super(responseData);
    if (payload) this.payload = payload;
    if (message) this.message = message;
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
  message: string | null = '<error message>';

  @ApiProperty({
    name: 'cause',
    type: String,
    example: null,
    nullable: true,
    required: false,
  })
  cause?: string | null = null;

  constructor(options?: WithMessageResponseData) {
    const { message = null, cause = null, ...responseData } = options ?? {};
    super(responseData);
    if (message) this.message = message;
    if (cause) this.cause = cause;
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
  status: HttpStatus = HttpStatus.UNAUTHORIZED;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '인증에 문제가 발생했습니다.',
  })
  message: string = '인증에 문제가 발생했습니다.';
}

/* 403 에러 응답 */
export class ForbiddenResponseDto extends ErrorResponseDto {
  status: HttpStatus = HttpStatus.FORBIDDEN;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '권한이 없습니다.',
  })
  message: string = '권한이 없습니다.';
}

/* 404 에러 응답 */
export class NotFoundResponseDto extends ErrorResponseDto {
  status: HttpStatus = HttpStatus.NOT_FOUND;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '리소스를 찾지 못했습니다.',
  })
  message: string = '리소스를 찾지 못했습니다.';
}

/* 409 에러 응답 */
export class ConflictResponseDto extends ErrorResponseDto {
  status: HttpStatus = HttpStatus.CONFLICT;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '중복된 리소스가 존재합니다.',
  })
  message: string = '중복된 리소스가 존재합니다.';
}

/* 500 에러 응답 */
export class InternalServerErrorResponseDto extends ErrorResponseDto {
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    name: 'message',
    type: String,
    example: '서버 오류가 발생했습니다.',
  })
  message: string = '서버 오류가 발생했습니다.';
}
