import { SetProperty } from '@common/decorator/set-property.decorator';

export class PayloadUserSecretDto {
  @SetProperty({
    description: 'id',
    value: 1,
  })
  id: number = 1;
}
