import { ConflictException, ErrorKey } from '@common/dto/response';

export class AlreadyExistsEmailExceptionDto extends ConflictException {
  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_EMAIL, reason });
  }
}
