import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSurveyResponseDto extends SuccessResponse<null> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_DELETE_SURVEY,
  })
  message: string = ErrorMessage.SUCCESS_DELETE_SURVEY;
}
