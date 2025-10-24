import { BadRequestException, ErrorKey, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequiredForAnswerExceptionDto extends BadRequestException {
  @ApiProperty({
    description: '예외 메시지',
    example: ErrorMessage.LOGIN_REQUIRED_FOR_ANSWER,
  })
  declare message: string;

  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.LOGIN_REQUIRED_FOR_ANSWER, reason });
  }
}
