import { fakerKO as faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

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
  name!: string;

  @ApiProperty({
    description: '닉네임',
    example: faker.person.firstName(),
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
}
