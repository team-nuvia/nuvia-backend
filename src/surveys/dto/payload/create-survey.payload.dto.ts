import { IsDatetimeString } from '@common/decorator/is-datetime-string.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { DateFormat } from '@util/dateFormat';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateSurveyQuestionPayloadNestedDto } from './create-survey-question.payload.nested.dto';

export class CreateSurveyPayloadDto {
  @ApiProperty({
    description: '설문 제목',
    example: '설문 제목',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    description: '설문 설명',
    example: '설문 설명',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: '설문 공개 여부',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({
    description: '설문 상태',
    example: SurveyStatus.Draft,
  })
  @IsNotEmpty()
  @IsEnum(SurveyStatus)
  status!: SurveyStatus;

  @ApiProperty({
    description: '설문 만료 일시',
    example: DateFormat.toUTC('YYYY-MM-ddTHH:mm:ss.SSSZ'),
  })
  @IsNullable()
  @IsDatetimeString()
  expiresAt!: Date | null;

  @ApiProperty({
    description: '질문 목록',
    example: [],
  })
  @IsNotEmpty()
  @IsArray()
  questions!: CreateSurveyQuestionPayloadNestedDto[];
}
