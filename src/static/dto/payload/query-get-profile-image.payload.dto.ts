import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { AvailableFormatInfo, FormatEnum } from 'sharp';
import { ResponseTypeParsePipe } from '../../pipe/response-type-parse.pipe';

export class DimensionDto {
  @ApiProperty({ name: 'width', example: 100 })
  width!: number;

  @ApiProperty({ name: 'height', example: 100 })
  height!: number;
}

export class QueryGetProfileImagePayloadDto {
  @ApiProperty({
    name: 'type',
    example: 'profile',
  })
  type!: string;

  @ApiProperty({ name: 'quality', example: 100, required: true })
  quality!: number;

  @ApiPropertyNullable({
    name: 'dimension',
    type: () => DimensionDto,
  })
  dimension!: DimensionDto | null;

  @ApiProperty({
    name: 'rs',
    example: 'webp',
  })
  @Validate(ResponseTypeParsePipe)
  responseType!: keyof FormatEnum | AvailableFormatInfo;
}
