import { ConflictException, ErrorKey } from '@common/dto/response';

export class AlreadyExistsUserExceptionDto extends ConflictException {
  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_USER, reason });
  }
}
