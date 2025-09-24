import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsPayloadDto {
  @ApiProperty({
    description: '메일링 여부',
    example: true,
  })
  mailing!: boolean;
}
