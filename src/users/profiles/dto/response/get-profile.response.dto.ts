import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetProfileResponseDto {
  @ApiProperty({ name: 'id', type: Number, example: 1 })
  id!: number;

  @ApiProperty({ name: 'userId', type: Number, example: 1 })
  userId!: number;

  @ApiProperty({ name: 'originalname', type: String, example: '1' })
  originalname!: string;

  @ApiProperty({ name: 'filename', type: String, example: '1' })
  filename!: string;

  @ApiProperty({ name: 'mimetype', type: String, example: '1' })
  mimetype!: string;

  @ApiProperty({ name: 'size', type: Number, example: 1 })
  size!: number;

  @ApiProperty({ name: 'width', type: Number, example: 1 })
  width!: number;

  @ApiProperty({ name: 'height', type: Number, example: 1 })
  height!: number;

  @ApiProperty({ name: 'imageUrl', type: Object, example: null })
  imageUrl!: {
    preview: {
      low: string;
      mid: string;
      high: string;
    };
    download: {
      low: string;
      mid: string;
      high: string;
    };
  };
}

export class GetProfileResponse extends GetResponse<GetProfileResponseDto> {
  @ApiProperty({ name: 'message', type: String, example: '프로필 조회 성공' })
  declare message: string;

  @ApiProperty({
    name: 'payload',
    type: GetProfileResponseDto,

    // example: new GetProfilePayload(),
  })
  declare payload: GetProfileResponseDto;
}
