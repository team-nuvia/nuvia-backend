import { SuccessResponseDto } from '@common/dto/global-response.dto';
import { PayloadLoginTokenDto } from '@common/dto/payload/payload-login-token.dto';
import { PayloadUserMeDto } from '@common/dto/payload/payload-user-me.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseGetVersionDto extends SuccessResponseDto {
  @ApiProperty({ name: 'message', type: String, example: '버전 조회 성공' })
  declare message: string;

  @ApiProperty({ name: 'payload', type: String, example: '1.0.0' })
  declare payload: string;

  constructor(payload: string, message = '버전 조회 성공') {
    super({ payload, message, reason: null });
  }
}

export class SuccessResponseLoginDto extends SuccessResponseDto<PayloadLoginTokenDto> {
  @ApiProperty({
    description: '토큰',
    type: PayloadLoginTokenDto,
  })
  declare payload: PayloadLoginTokenDto;

  @ApiProperty({
    description: '로그인 성공',
    type: String,
    example: '로그인 성공',
  })
  declare message: string;
}

export class SuccessResponseUserMeDto extends SuccessResponseDto<PayloadUserMeDto> {
  @ApiProperty({
    description: '사용자 정보',
    type: PayloadUserMeDto,
  })
  declare payload: PayloadUserMeDto;

  @ApiProperty({
    description: '사용자 정보 조회 성공',
    type: String,
    example: '사용자 정보 조회 성공',
  })
  declare message: string;
}
