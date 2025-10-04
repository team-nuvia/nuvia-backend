import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserLoginInformationPayloadDto } from './user-login-information.payload.dto';

export class SocialLoginInformationPayloadDto extends OmitType(UserLoginInformationPayloadDto, ['email', 'password']) {
  @ApiPropertyOptional({
    description: '리다이렉트 URL',
    example: 'https://example.com',
  })
  @IsString()
  @IsOptional()
  redirect?: string;

  @ApiPropertyOptional({
    description: '리다이렉트 URL',
    example: 'https://example.com',
  })
  @IsString()
  @IsOptional()
  action?: string;
}
