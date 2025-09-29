import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserSettingsPayloadDto {
  @ApiProperty({
    description: '메일링 여부',
    example: true,
  })
  @IsBoolean()
  mailing!: boolean;
}
