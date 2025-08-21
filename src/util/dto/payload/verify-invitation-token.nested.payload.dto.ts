import { ApiProperty } from '@nestjs/swagger';

export class VerifyInvitationTokenNestedPayloadDto {
  @ApiProperty({ description: '초대 토큰 검증 여부', example: true })
  verified!: boolean;

  @ApiProperty({ description: '초대 받은 조직 ID', example: 1 })
  subscriptionId!: number;

  @ApiProperty({ description: '초대 받은 사용자 ID', example: 1 })
  inviteeId!: number;
}
