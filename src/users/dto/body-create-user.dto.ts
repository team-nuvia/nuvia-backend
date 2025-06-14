import { Sample, UserRole } from '@common/variable/enums';
import { fakerKO as faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';

export class BodyCreateUserDto {
  @ApiProperty({
    name: 'email',
    type: String,
    example: faker.internet.email({
      firstName: 'lowfi',
      lastName: 'awesome',
      provider: 'example.com',
    }),
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    name: 'username',
    type: String,
    example: faker.person.fullName(),
  })
  username!: string;

  @ApiProperty({
    name: 'nickname',
    type: String,
    example: faker.helpers.mustache('{{first}}{{last}}', {
      first: faker.helpers.arrayElement(Sample.username.first),
      last: faker.helpers.arrayElement(Sample.username.last),
    }),
  })
  nickname!: string;

  @ApiProperty({
    name: 'password',
    type: String,
    example: 'qweQQ!!1',
    description:
      '최소 5자 이상, 숫자, 대/소문자, 특수문자 1개씩 포함되어야 합니다.',
  })
  @IsStrongPassword({
    minLength: 5,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  @ApiProperty({
    name: 'role',
    enum: UserRole,
    type: () => UserRole,
    example: UserRole.User,
    description: `사용자 권한:<br>${Object.entries(UserRole)
      .map(([role, value]) => `${role}: ${value}`)
      .join('<br>')}`,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
