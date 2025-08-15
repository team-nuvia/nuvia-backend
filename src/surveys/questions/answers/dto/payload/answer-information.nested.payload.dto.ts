import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class AnswerInformationNestedPayloadDto {
  @ApiProperty({
    description: '질문 ID',
  })
  @IsNumber()
  questionId!: number;

  @ApiProperty({
    description: '선택한 옵션 ID 목록',
    isArray: true,
    nullable: true,
  })
  @IsNullable()
  @IsArray()
  @IsNumber({}, { each: true })
  optionIds!: number[] | null;

  @ApiProperty({
    description: '답변 값',
    nullable: true,
  })
  @IsNullable()
  @IsString()
  value!: string | null;
}
