import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordSendNestedResponseDto {
  @ApiProperty({ example: '<token>' })
  token: string = '<token>';
}

export class ResetPasswordSendResponseDto extends SuccessResponse<ResetPasswordSendNestedResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_RESET_PASSWORD_SEND })
  message: string = ErrorMessage.SUCCESS_RESET_PASSWORD_SEND;

  @ApiProperty({ example: ResetPasswordSendNestedResponseDto })
  declare payload: ResetPasswordSendNestedResponseDto;

  constructor(payload: ResetPasswordSendNestedResponseDto = new ResetPasswordSendNestedResponseDto()) {
    super(payload);
  }
}
