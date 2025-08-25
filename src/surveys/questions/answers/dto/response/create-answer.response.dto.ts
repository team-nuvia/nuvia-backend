import { CreatedResponse, ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerResponseDto extends CreatedResponse<null> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_CREATE_ANSWER,
  })
  message: string = ErrorMessage.SUCCESS_CREATE_ANSWER;
}
