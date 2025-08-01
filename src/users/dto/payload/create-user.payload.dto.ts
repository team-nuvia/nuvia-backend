import { Sample } from '@common/variable/enums';
import { fakerKO as faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserPayloadDto {
  @ApiProperty({
    description: '이메일',
    example: faker.internet.email({
      firstName: 'lowfi',
      lastName: 'awesome',
      provider: 'example.com',
    }),
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '이름',
    example: faker.person.fullName(),
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: '닉네임',
    example: faker.helpers.mustache('{{first}}{{last}}', {
      first: faker.helpers.arrayElement(Sample.username.first),
      last: faker.helpers.arrayElement(Sample.username.last),
    }),
  })
  @IsString()
  nickname!: string;

  @ApiProperty({
    description: '최소 5자 이상, 숫자, 대/소문자, 특수문자 1개씩 포함되어야 합니다.',
    example: 'qweQQ!!1',
  })
  @IsStrongPassword({
    minLength: 5,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsString()
  password!: string;

  @ApiProperty({
    description: `사용자 권한:<br>${Object.entries(UserRole)
      .map(([role, value]) => `${role}: ${value}`)
      .join('<br>')}`,
    enum: UserRole,
    example: UserRole.Viewer,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
