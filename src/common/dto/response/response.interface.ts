import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseResponse<T extends any = any> implements IBaseResponse<T> {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  ok!: boolean;

  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.OK,
  })
  httpStatus!: HttpStatus;

  @ApiProperty({
    description: '이름',
    example: '<ResponseDtoName>',
  })
  name!: string;

  @ApiPropertyNullable({
    description: '메시지',
    example: '<response message>',
  })
  message!: StringOrNull;

  @ApiPropertyNullable({
    description: '이유',
    example: '<response reason>',
  })
  reason!: StringOrNull;

  @ApiPropertyNullable({
    description: '페이로드',
    example: null,
  })
  payload!: TypeOrNull<T>;

  constructor(httpStatus: HttpStatus, payload: TypeOrNull<T> = null) {
    this.ok = true;
    this.httpStatus = httpStatus;
    this.name = this.constructor.name;
    this.message = null;
    this.reason = null;
    this.payload = payload;
  }
}

/* SuccessResponse */
export class SuccessResponse<T extends any> extends BaseResponse<T> {
  constructor(payload: TypeOrNull<T> = null) {
    super(HttpStatus.OK, payload);
  }
}

/* Success Data Response */
export class GetResponse<T extends any> extends SuccessResponse<T> {
  constructor(payload: TypeOrNull<T> = null) {
    super(payload);
  }
}

/* 201 */
export class CreatedResponse<T extends any> extends BaseResponse<T> {
  constructor(payload: TypeOrNull<T> = null) {
    super(HttpStatus.CREATED, payload);
  }
}
