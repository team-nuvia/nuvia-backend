import { BadRequestException } from '@common/dto/response/exception.interface';
import { ErrorKey } from '../response';

export class InvalidInputValueException extends BadRequestException {
  constructor(reason: string | null = null) {
    super({ code: ErrorKey.INVALID_INPUT_VALUE, reason });
  }
}
