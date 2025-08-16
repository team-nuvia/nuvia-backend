import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class RestoreSurveyResponseDto extends SuccessResponse<null> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_RESTORE_SURVEY,
  })
  message: string = ErrorMessage.SUCCESS_RESTORE_SURVEY;
}
