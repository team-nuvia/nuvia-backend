import { ApiProperty } from '@nestjs/swagger';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { IsEnum } from 'class-validator';

export class SurveyMetadataQueryParamDto {
  @ApiProperty({
    description: '상태',
    enum: MetadataStatusType,
    example: MetadataStatusType.Dashboard,
  })
  @IsEnum(MetadataStatusType)
  status!: MetadataStatusType;
}
