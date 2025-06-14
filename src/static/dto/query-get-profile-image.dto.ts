import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { AvailableFormatInfo, FormatEnum } from 'sharp';
import { ResponseTypeParsePipe } from '../pipe/response-type-parse.pipe';

export class DimensionDto {
  @ApiProperty({ name: 'width', type: Number, example: 100, required: true })
  width!: number;

  @ApiProperty({ name: 'height', type: Number, example: 100, required: true })
  height!: number;
}

export class QueryGetProfileImageDto {
  @ApiProperty({
    name: 'type',
    type: String,
    example: 'profile',
    required: true,
  })
  type!: string;

  @ApiProperty({ name: 'quality', type: Number, example: 100, required: true })
  quality!: number;

  @ApiProperty({
    name: 'dimension',
    type: () => DimensionDto,
    example: new DimensionDto(),
    required: false,
    nullable: true,
  })
  dimension!: DimensionDto | null;

  @ApiProperty({
    name: 'rs',
    type: String,
    example: 'webp',
    required: true,
  })
  @Validate(ResponseTypeParsePipe)
  responseType!: keyof FormatEnum | AvailableFormatInfo;
}
