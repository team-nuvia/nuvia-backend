import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSurveyVisibilityResponseDto extends SuccessResponse<null> {
  @ApiProperty({
    description: '메시지',
    example: ErrorMessage.SUCCESS_UPDATE_SURVEY_VISIBILITY,
  })
  message: string = ErrorMessage.SUCCESS_UPDATE_SURVEY_VISIBILITY;
}
