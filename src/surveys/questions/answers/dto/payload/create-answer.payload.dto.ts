import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AnswerInformationNestedPayloadDto } from './answer-information.nested.payload.dto';

export class CreateAnswerPayloadDto {
  @ApiProperty({
    type: () => AnswerInformationNestedPayloadDto,
    description: '답변 정보',
  })
  @ValidateNested()
  @Type(() => AnswerInformationNestedPayloadDto)
  answers!: AnswerInformationNestedPayloadDto[];
}
