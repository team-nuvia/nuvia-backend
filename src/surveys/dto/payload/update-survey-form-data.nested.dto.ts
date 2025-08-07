import { IsDatetimeString } from '@common/decorator/is-datetime-string.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { DateFormat } from '@util/dateFormat';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSurveyFormDataNestedDto {
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
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsDatetimeString()
  expiresAt!: Date | null;
}
