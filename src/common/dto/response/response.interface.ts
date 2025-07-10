import { RequestMethod } from '@common/variable/enums';
import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T> implements IResponse<T> {
  ok!: boolean;
  httpStatus!: HttpStatus;
  method!: RequestMethod;
  path!: string;
  timestamp!: Date;
  payload!: T | null;
  message!: string | null;
  reason!: string | null;

  constructor(ok: boolean, httpStatus: HttpStatus, method: RequestMethod) {
    this.ok = ok;
    this.httpStatus = httpStatus;
    this.method = method;
    this.path = '/<path>';
    this.timestamp = new Date();
    this.payload = null;
    this.message = null;
    this.reason = null;
  }
}

/* 200 */
export class SuccessResponse<T> extends BaseResponse<T> {
  constructor(payload: T | null = null) {
    super(true, HttpStatus.OK, RequestMethod.GET);
    this.payload = payload;
  }
}

/* 201 */
export class CreatedResponse<T> extends BaseResponse<T> {
  constructor() {
    super(true, HttpStatus.CREATED, RequestMethod.POST);
  }
}

/* 204 */
export class NoContentResponse<T> extends BaseResponse<T> {
  constructor() {
    super(true, HttpStatus.NO_CONTENT, RequestMethod.DELETE);
  }
}
