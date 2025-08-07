import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ErrorMessage } from '@common/dto/response';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ImageUrlLevelType {
  @ApiProperty({ name: 'low', example: 'https://example.com/low.jpg' })
  low: string = 'https://example.com/low.jpg';

  @ApiProperty({ name: 'mid', example: 'https://example.com/mid.jpg' })
  mid: string = 'https://example.com/mid.jpg';

  @ApiProperty({ name: 'high', example: 'https://example.com/high.jpg' })
  high: string = 'https://example.com/high.jpg';
}

export class ImageUrlType {
  @ApiProperty({ name: 'preview', type: () => ImageUrlLevelType })
  preview!: ImageUrlLevelType;

  @ApiProperty({ name: 'download', type: () => ImageUrlLevelType })
  download!: ImageUrlLevelType;
}

export class GetProfileResponseDto {
  @ApiProperty({ name: 'id', example: 1 })
  id: number = 1;

  @ApiProperty({ name: 'userId', example: 1 })
  userId: number = 1;

  @ApiProperty({ name: 'originalname', example: '1' })
  originalname: string = '1';

  @ApiProperty({ name: 'filename', example: '1' })
  filename: string = '1';

  @ApiProperty({ name: 'mimetype', example: '1' })
  mimetype: string = '1';

  @ApiProperty({ name: 'size', example: 1 })
  size: number = 1;

  @ApiProperty({ name: 'width', example: 1 })
  width: number = 1;

  @ApiProperty({ name: 'height', example: 1 })
  height: number = 1;

  @ApiPropertyNullable({ name: 'imageUrl', type: () => ImageUrlType })
  imageUrl!: ImageUrlType;
}

export class GetProfileResponse extends GetResponse<GetProfileResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_PROFILE })
  message: string = ErrorMessage.SUCCESS_GET_PROFILE;

  @ApiProperty({ description: '프로필 데이터', type: () => GetProfileResponseDto })
  declare payload: GetProfileResponseDto;

  constructor(payload: GetProfileResponseDto = new GetProfileResponseDto()) {
    super(payload);
  }
}
