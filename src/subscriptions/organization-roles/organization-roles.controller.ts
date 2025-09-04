import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationRolePayloadDto } from './dto/payload/update-organization-role.payload.dto';
import { GetOrganizationRolesResponseDto } from './dto/response/get-organization-roles.response.dto';
import { UpdateOrganizationRoleResponseDto } from './dto/response/update-organization-role.response.dto';
import { OrganizationRoleUpdateConstraintValidation } from './organization-role-update-constraint.guard';
import { OrganizationRolesService } from './organization-roles.service';

@RequiredLogin
@ApiTags('조직 역할')
@Controller(':subscriptionId/organization-roles')
export class OrganizationRolesController {
  constructor(private readonly organizationRolesService: OrganizationRolesService) {}

  @ApiOperation({ summary: '조직 역할 목록 조회' })
  @CombineResponses(HttpStatus.OK, GetOrganizationRolesResponseDto)
  @RequiredLogin
  @Get()
  async findAll(@Param('subscriptionId') subscriptionId: string): Promise<GetOrganizationRolesResponseDto> {
    const roles = await this.organizationRolesService.findAll(+subscriptionId);
    return new GetOrganizationRolesResponseDto(roles);
  }

  // TODO: 조직 역할 수정 시 권한을 수정자의 권한 이하만 가능하도록 검증 추가
  @CombineResponses(HttpStatus.OK, UpdateOrganizationRoleResponseDto)
  @OrganizationRoleUpdateConstraintValidation()
  @Patch(':organizationRoleId')
  async update(
    @LoginUser() user: LoginUserData,
    @Param('subscriptionId') subscriptionId: number,
    @Param('organizationRoleId') organizationRoleId: number,
    @Body() updateOrganizationRolePayloadDto: UpdateOrganizationRolePayloadDto,
  ): Promise<UpdateOrganizationRoleResponseDto> {
    await this.organizationRolesService.update(+subscriptionId, +organizationRoleId, user.id, updateOrganizationRolePayloadDto);
    return new UpdateOrganizationRoleResponseDto();
  }

  @Delete(':organizationRoleId')
  remove(@Param('subscriptionId') subscriptionId: string, @Param('organizationRoleId') organizationRoleId: string) {
    return this.organizationRolesService.remove(+subscriptionId, +organizationRoleId);
  }
}
