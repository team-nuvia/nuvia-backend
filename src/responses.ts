import { SetProperty } from '@common/decorator/set-property.decorator';
import { GetResponse } from '@common/dto/response/response.interface';

export class GetVersionResponse extends GetResponse {
  @SetProperty({ description: '버전 조회 성공', value: '버전 조회 성공' })
  declare message: string;

  @SetProperty({ description: '버전', value: '1.0.0' })
  declare payload: string;

  constructor(payload: string) {
    super(payload);
  }
}
