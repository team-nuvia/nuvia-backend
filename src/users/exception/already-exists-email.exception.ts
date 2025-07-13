import { ConflictException, ErrorKey } from '@common/dto/response';

export class AlreadyExistsEmailException extends ConflictException {
  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_EMAIL, reason });
  }
}
