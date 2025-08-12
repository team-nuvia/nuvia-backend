import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: '조직 이름',
    example: '조직 이름',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: '조직 설명',
    example: '조직 설명',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: '기본 역할',
    example: '기본 역할',
  })
  @IsOptional()
  @IsEnum(UserRole)
  defaultRole?: UserRole;
}
