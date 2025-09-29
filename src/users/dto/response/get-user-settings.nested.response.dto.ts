import { ApiProperty } from '@nestjs/swagger';

export class GetUserSettingsNestedResponseDto {
  @ApiProperty({ description: 'mailing', example: true })
  mailing: boolean = true;
}
