import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetVersionResponse extends GetResponse {
  @ApiProperty({ description: '버전 조회 성공', example: '버전 조회 성공' })
  declare message: string;

  @ApiProperty({ description: '버전', example: '1.0.0' })
  declare payload: string;
}
