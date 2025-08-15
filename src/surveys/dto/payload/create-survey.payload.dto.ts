import { IsDatetimeString } from '@common/decorator/is-datetime-string.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ErrorMessage } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { DateFormat } from '@util/dateFormat';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateSurveyQuestionPayloadNestedDto } from './create-survey-question.payload.nested.dto';

export class CreateSurveyPayloadDto {
  @ApiProperty({
    description: '설문 카테고리 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId!: number;

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
  @IsNullable()
  @IsString()
  description!: string | null;

  @ApiProperty({
    description: '설문 공개 여부',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({
    enum: SurveyStatus,
    description: '설문 상태',
    example: SurveyStatus.Active,
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
  @ArrayMinSize(1, { message: ErrorMessage.REQUIRED_QUESTION_AT_LEAST_ONE })
  questions!: CreateSurveyQuestionPayloadNestedDto[];
}
