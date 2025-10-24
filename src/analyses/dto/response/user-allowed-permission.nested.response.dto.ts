import { ApiProperty } from '@nestjs/swagger';

export class AllowedDownloadNestedResponseDto {
  @ApiProperty({ description: 'PDF 다운로드 권한', example: true })
  excel: boolean = true;
  @ApiProperty({ description: 'EXCEL 다운로드 권한', example: true })
  pdf: boolean = true;
}

export class UserAllowedPermissionNestedResponseDto {
  @ApiProperty({ description: '다운로드 권한', type: () => AllowedDownloadNestedResponseDto })
  download: AllowedDownloadNestedResponseDto = new AllowedDownloadNestedResponseDto();
}
