import { SetProperty } from '@common/decorator/set-property.decorator';

export class BodyLoginDto {
  @SetProperty({
    description: '이메일',
    value: 'test@example.com',
  })
  email!: string;

  @SetProperty({
    description: '비밀번호',
    value: 'qweQQ!!1',
  })
  password!: string;
}
