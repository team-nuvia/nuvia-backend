import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetHealthCheckResponseDto extends GetResponse<string> {
  @ApiProperty({ description: '메시지', example: 'OK' })
  message: string = 'OK';

  @ApiProperty({ description: '상태', example: 'OK' })
  declare payload: string;

  constructor(payload: string = 'OK') {
    super(payload);
  }
}
