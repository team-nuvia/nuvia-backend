import { IsEnumString } from '@common/decorator/is-enum-string.decorator';
import { SearchQueryParamDto } from '@common/dto/param/search-query.param.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyStatus } from '@share/enums/survey-status';
import { IsOptional } from 'class-validator';

export class SurveySearchQueryParamDto extends SearchQueryParamDto {
  @ApiProperty({
    description: '상태',
    required: false,
    example: Object.values(SurveyStatus).join(','),
  })
  @IsOptional()
  @IsEnumString(SurveyStatus)
  status!: string;
}
