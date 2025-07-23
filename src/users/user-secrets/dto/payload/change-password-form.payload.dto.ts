import { SetProperty } from '@common/decorator/set-property.decorator';

export class ChangePasswordFormPayloadDto {
  @SetProperty({
    description: '이전 비밀번호',
    value: '이전 비밀번호',
  })
  prevPassword!: string;

  @SetProperty({
    description: '새 비밀번호',
    value: '새 비밀번호',
  })
  newPassword!: string;
}
