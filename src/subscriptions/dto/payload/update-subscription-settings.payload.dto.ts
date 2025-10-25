import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseFormat } from '@share/enums/response-format';
import { UserRole } from '@share/enums/user-role';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSubscriptionSettingsPayloadDto {
  @ApiPropertyOptional({ description: '팀 이름', example: '팀 이름' })
  @IsOptional()
  @IsString()
  teamName?: string;

  @ApiPropertyOptional({ description: '팀 설명', example: '팀 설명', nullable: true })
  @IsOptional()
  @IsString()
  teamDescription?: string | null;

  @ApiPropertyOptional({ description: '팀 기본 역할', enum: UserRole, example: UserRole.Owner })
  @IsOptional()
  @IsEnum(UserRole)
  teamDefaultRole?: UserRole;

  @ApiPropertyOptional({ description: '응답 렌더 타입', enum: ResponseFormat, example: ResponseFormat.Slide })
  @IsOptional()
  @IsEnum(ResponseFormat)
  responseFormat?: ResponseFormat;
}
