import { IsDatetimeString } from '@common/decorator/is-datetime-string.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { DateFormat } from '@util/dateFormat';
import { CreateSurveyPayloadDto } from './create-survey.payload.dto';

export class UpdateSurveyFormDataNestedDto extends OmitType(PartialType(CreateSurveyPayloadDto), ['questions', 'expiresAt']) {
  @ApiProperty({
    description: '설문 만료 일시',
    example: DateFormat.toUTC('YYYY-MM-ddTHH:mm:ss.SSSZ'),
  })
  @IsNullable()
  @IsDatetimeString()
  // @IsPastThanNextDay()
  expiresAt!: Date | null;
}
