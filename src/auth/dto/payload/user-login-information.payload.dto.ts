import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { IsNullable } from '@common/decorator/is-nullable.decorator';
import { IsString } from 'class-validator';
import { LoginFormPayloadDto } from './login-form.payload.dto';

export class UserLoginInformationPayloadDto extends LoginFormPayloadDto {
  @ApiPropertyNullable({
    description: '접속 디바이스',
    example: 'Browser',
  })
  @IsNullable()
  @IsString()
  accessDevice!: string | null;

  @ApiPropertyNullable({
    description: '접속 브라우저',
    example: 'Chrome',
  })
  @IsNullable()
  @IsString()
  accessBrowser!: string | null;

  @ApiPropertyNullable({
    description: '접속 유저 에이전트',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  })
  @IsNullable()
  @IsString()
  accessUserAgent!: string | null;
}
