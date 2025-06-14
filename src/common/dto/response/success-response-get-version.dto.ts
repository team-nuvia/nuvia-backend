import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseGetVersionDto extends SuccessResponseDto {
  message = '버전 조회 성공';

  @ApiProperty({ name: 'payload', type: String, example: '1.0.0' })
  payload: string = '1.0.0';
}
