import { SetProperty } from '@common/decorator/set-property.decorator';
import { Sample, UserRole } from '@common/variable/enums';
import { fakerKO as faker } from '@faker-js/faker';
import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';

export class BodyCreateUserDto {
  @SetProperty({
    description: '이메일',
    value: faker.internet.email({
      firstName: 'lowfi',
      lastName: 'awesome',
      provider: 'example.com',
    }),
  })
  @IsEmail()
  email!: string;

  @SetProperty({
    description: '이름',
    value: faker.person.fullName(),
  })
  username!: string;

  @SetProperty({
    description: '닉네임',
    value: faker.helpers.mustache('{{first}}{{last}}', {
      first: faker.helpers.arrayElement(Sample.username.first),
      last: faker.helpers.arrayElement(Sample.username.last),
    }),
  })
  nickname!: string;

  @SetProperty({
    description: '최소 5자 이상, 숫자, 대/소문자, 특수문자 1개씩 포함되어야 합니다.',
    value: 'qweQQ!!1',
  })
  @IsStrongPassword({
    minLength: 5,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  @SetProperty({
    description: `사용자 권한:<br>${Object.entries(UserRole)
      .map(([role, value]) => `${role}: ${value}`)
      .join('<br>')}`,
    value: UserRole.User,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
