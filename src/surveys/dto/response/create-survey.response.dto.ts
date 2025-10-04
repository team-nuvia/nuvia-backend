import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSurveyNestedResponseDto {
  @ApiProperty({
    description: '설문 아이디',
    example: 1,
  })
  id: number = 1;
}

export class CreateSurveyResponseDto extends SuccessResponse<CreateSurveyNestedResponseDto> {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_CREATE_SURVEY,
  })
  message: string = ErrorMessage.SUCCESS_CREATE_SURVEY;

  @ApiProperty({
    description: '설문 아이디',
    example: 1,
  })
  declare payload: CreateSurveyNestedResponseDto;

  constructor(payload: CreateSurveyNestedResponseDto = new CreateSurveyNestedResponseDto()) {
    super(payload);
  }
}
