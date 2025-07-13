import { ErrorKey } from '@common/dto/response';
import { BadRequestException } from '@common/dto/response/exception.interface';

export class NoMatchUserInformationException extends BadRequestException {
  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NO_MATCH_USER_INFORMATION, reason });
  }
}
