import { ErrorKey } from '@common/dto/response';
import { ConflictException } from '@common/dto/response/exception.interface';

export class AlreadyExistsUserExceptionDto extends ConflictException {
  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.ALREADY_EXISTS_USER, reason });
  }
}
