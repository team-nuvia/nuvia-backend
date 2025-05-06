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
  status!: HttpStatus;

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
    type: Number,
    example: Date.now().toString(),
  })
  timestamp!: number;

  constructor(responseData: DefaultResponseData) {
    this.ok = [HttpStatus.OK, HttpStatus.CREATED].includes(responseData.status);
    if (!isNil(responseData) && !isNil(responseData.status))
      this.status = responseData.status;
    if (!isNil(responseData) && !isNil(responseData.method))
      this.method = responseData.method;
    if (!isNil(responseData) && !isNil(responseData.path))
      this.path = responseData.path;
    this.timestamp = Date.now();
  }
}

export class OkResponseDto<T = any> extends CommonResponseDto {
  @ApiProperty({ name: 'payload', nullable: true })
  payload!: T | T[];

  @ApiProperty({
    name: 'message',
    type: String,
    example: '<success message>',
    nullable: true,
  })
  message!: string | null;

  constructor({
    payload,
    message,
    ...responseData
  }: WithMessageCommonResponseData<T>) {
    super(responseData);
    if (payload) this.payload = payload;
    if (message) this.message = message;
  }
}

export const FactoryErrorResponseDto = (message: string, detail?: string) => {
  class ErrorCommonResponseDto extends CommonResponseDto {
    @ApiProperty({
      name: 'message',
      type: String,
      nullable: true,
      example: message,
    })
    message!: string;

    @ApiProperty({
      name: 'detail',
      nullable: true,
      example: detail ?? '<reason>',
    })
    detail!: string | null;

    constructor({ message, detail, ...responseData }: WithMessageResponseData) {
      super(responseData);
      if (message) this.message = message;
      if (detail) this.detail = detail;
    }
  }
  return ErrorCommonResponseDto;
};

export class NotFoundResponseDto extends FactoryErrorResponseDto(
  '리소스를 찾지 못했습니다',
  '<detail_message>',
) {}

export class ConflictResponseDto extends FactoryErrorResponseDto(
  '중복된 리소스가 존재합니다.',
  '<detail_message>',
) {}

export class ForbiddenResponseDto extends FactoryErrorResponseDto(
  '권한이 없습니다.',
  '<detail_message>',
) {}

export class BadRequestResponseDto extends FactoryErrorResponseDto(
  '잘못된 요청입니다.',
  '<detail_message>',
) {}

export class UnauthorizedResponseDto extends FactoryErrorResponseDto(
  '인증에 문제가 발생했습니다.',
  '<detail_message>',
) {}
