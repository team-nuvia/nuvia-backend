import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus } from '@share/enums/answer-status';
import { Type } from 'class-transformer';
import { IsEnum, ValidateNested } from 'class-validator';
import { AnswerInformationNestedPayloadDto } from './answer-information.nested.payload.dto';

export class CreateAnswerPayloadDto {
  @ApiProperty({
    type: () => AnswerInformationNestedPayloadDto,
    description: '답변 정보',
    example: new AnswerInformationNestedPayloadDto(),
  })
  @ValidateNested()
  @Type(() => AnswerInformationNestedPayloadDto)
  answers!: AnswerInformationNestedPayloadDto[];

  @ApiProperty({
    enum: AnswerStatus,
    description: '답변 상태',
    example: AnswerStatus.InProgress,
  })
  @IsEnum(AnswerStatus)
  status!: AnswerStatus;
}
