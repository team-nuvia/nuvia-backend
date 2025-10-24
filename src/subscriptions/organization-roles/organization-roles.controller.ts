import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { UnauthorizedException } from '@common/dto/response';
import { Body, Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundOrganizationRoleExceptionDto } from './dto/exception/not-found-organization-role.exception.dto';
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

  @ApiOperation({ summary: '조직 역할 수정' })
  @CombineResponses(HttpStatus.OK, UpdateOrganizationRoleResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundOrganizationRoleExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @OrganizationRoleUpdateConstraintValidation()
  @Transactional()
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

  // @ApiOperation({ summary: '조직 역할 삭제' })
  // @CombineResponses(HttpStatus.OK, DeleteOrganizationRoleResponseDto)
  // @CombineResponses(HttpStatus.NOT_FOUND, NotFoundOrganizationRoleExceptionDto)
  // @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  // @Transactional()
  // @Delete(':organizationRoleId')
  // remove(@Param('subscriptionId') subscriptionId: string, @Param('organizationRoleId') organizationRoleId: string) {
  //   return this.organizationRolesService.remove(+subscriptionId, +organizationRoleId);
  // }
}
