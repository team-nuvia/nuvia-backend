import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateSurveyVisibilityPayloadDto {
  @ApiProperty({
    description: '설문 공개 여부',
    example: true,
  })
  @IsBoolean()
  isPublic!: boolean;
}
