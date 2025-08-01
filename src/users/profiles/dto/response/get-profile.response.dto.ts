import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ImageUrlLevelType {
  @ApiProperty({ name: 'low', example: 'https://example.com/low.jpg' })
  low!: string;

  @ApiProperty({ name: 'mid', example: 'https://example.com/mid.jpg' })
  mid!: string;

  @ApiProperty({ name: 'high', example: 'https://example.com/high.jpg' })
  high!: string;
}

export class ImageUrlType {
  @ApiProperty({ name: 'preview', type: ImageUrlLevelType })
  preview!: ImageUrlLevelType;

  @ApiProperty({ name: 'download', type: ImageUrlLevelType })
  download!: ImageUrlLevelType;
}

export class GetProfileResponseDto {
  @ApiProperty({ name: 'id', example: 1 })
  id!: number;

  @ApiProperty({ name: 'userId', example: 1 })
  userId!: number;

  @ApiProperty({ name: 'originalname', example: '1' })
  originalname!: string;

  @ApiProperty({ name: 'filename', example: '1' })
  filename!: string;

  @ApiProperty({ name: 'mimetype', example: '1' })
  mimetype!: string;

  @ApiProperty({ name: 'size', example: 1 })
  size!: number;

  @ApiProperty({ name: 'width', example: 1 })
  width!: number;

  @ApiProperty({ name: 'height', example: 1 })
  height!: number;

  @ApiPropertyNullable({ name: 'imageUrl', type: ImageUrlType })
  imageUrl!: ImageUrlType;
}

export class GetProfileResponse extends GetResponse<GetProfileResponseDto> {
  @ApiProperty({ name: 'message', type: String, example: '프로필 조회 성공' })
  declare message: string;

  @ApiProperty({ name: 'payload', type: GetProfileResponseDto })
  declare payload: GetProfileResponseDto;
}
