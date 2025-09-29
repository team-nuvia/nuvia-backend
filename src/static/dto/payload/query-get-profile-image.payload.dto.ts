import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Validate } from 'class-validator';
import { FormatEnum } from 'sharp';
import { ResponseTypeParsePipe } from '../../pipe/response-type-parse.pipe';

export class DimensionDto {
  @ApiProperty({ name: 'width', example: 100 })
  @IsNumber()
  width!: number;

  @ApiProperty({ name: 'height', example: 100 })
  @IsNumber()
  height!: number;
}

export class QueryGetProfileImagePayloadDto {
  @ApiProperty({
    name: 'type',
    example: 'profile',
  })
  @IsString()
  type!: string;

  @ApiProperty({ name: 'quality', example: 100, required: true })
  @IsNumber()
  quality!: number;

  @ApiPropertyNullable({
    name: 'dimension',
    type: () => DimensionDto,
  })
  @Type(() => DimensionDto)
  @IsNullable()
  dimension!: DimensionDto | null;

  @ApiProperty({
    name: 'rs',
    example: 'webp',
  })
  @Validate(ResponseTypeParsePipe)
  @IsString()
  responseType!: keyof FormatEnum;
}
