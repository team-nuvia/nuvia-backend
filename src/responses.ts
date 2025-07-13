import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetVersionResponse extends GetResponse {
  @ApiProperty({ name: 'message', type: String, example: '버전 조회 성공' })
  declare message: string;

  @ApiProperty({ name: 'payload', type: String, example: '1.0.0' })
  declare payload: string;

  constructor(payload: string) {
    super(payload);
  }
}
