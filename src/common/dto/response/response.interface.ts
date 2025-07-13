import { SetPropertyNullable } from '@common/decorator/set-property-nullable.decorator';
import { SetProperty } from '@common/decorator/set-property.decorator';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseResponse<T extends any = any> implements IBaseResponse<T> {
  @SetProperty({
    description: '성공 여부',
    value: true,
  })
  ok!: boolean;

  @SetProperty({
    description: 'HTTP 상태 코드',
    value: HttpStatus.OK,
    enum: HttpStatus,
  })
  httpStatus!: HttpStatus;

  @SetProperty({
    description: '이름',
    value: '<ResponseDtoName>',
  })
  name!: string;

  @SetPropertyNullable({
    description: '메시지',
    value: '<response message>',
  })
  message!: StringOrNull;

  @SetPropertyNullable({
    description: '이유',
    value: '<response reason>',
  })
  reason!: StringOrNull;

  @SetPropertyNullable({
    description: '페이로드',
    value: null,
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
export class SuccessResponse<T extends any = any> extends BaseResponse<T> {
  constructor(httpStatus: HttpStatus = HttpStatus.OK, payload: TypeOrNull<T> = null) {
    super(httpStatus, payload);
  }
}

/* Success Data Response */
export class GetResponse<T extends any = any> extends SuccessResponse<T> {
  constructor(payload: TypeOrNull<T> = null) {
    super(HttpStatus.OK, payload);
  }
}

/* 201 */
export class CreatedResponse<T extends any = any> extends SuccessResponse<T> {
  constructor(payload: TypeOrNull<T> = null) {
    super(HttpStatus.CREATED, payload);
  }
}
