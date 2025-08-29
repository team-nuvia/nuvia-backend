import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateUserCurrentOrganizationPayloadDto {
  @ApiProperty({
    description: '조직 ID',
    example: 1,
  })
  @IsNumber()
  organizationId!: number;
}
