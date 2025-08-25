import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class AnswerInformationNestedPayloadDto {
  @ApiProperty({
    description: '질문 ID',
    example: 1,
  })
  @IsNumber()
  questionId!: number;

  @ApiPropertyNullable({
    description: '선택한 옵션 ID 목록',
    isArray: true,
    nullable: true,
    example: [1, 2, 3],
  })
  @IsNullable()
  @IsArray()
  @IsNumber({}, { each: true })
  optionIds!: number[] | null;

  @ApiPropertyNullable({
    description: '답변 값',
    nullable: true,
    example: '답변 값',
  })
  @IsNullable()
  @IsString()
  value!: string | null;
}
