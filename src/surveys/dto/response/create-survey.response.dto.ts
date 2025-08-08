import { ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSurveyResponseDto {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_CREATE_SURVEY,
  })
  message: string = ErrorMessage.SUCCESS_CREATE_SURVEY;
}
