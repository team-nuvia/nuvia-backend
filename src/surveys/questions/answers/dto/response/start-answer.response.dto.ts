import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class StartAnswerResponseDto extends SuccessResponse<void> {
  @ApiProperty({
    description: '설문 답변 시작 메시지',
    example: ErrorMessage.SUCCESS_START_ANSWER,
  })
  message: string = ErrorMessage.SUCCESS_START_ANSWER;
}
