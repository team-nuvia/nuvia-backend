import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@common/dto/response/exception.interface';
import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserOrganizationsResponseDto } from '../subscriptions/organization-roles/dto/response/get-user-organizations.response.dto';
import { AlreadyExistsUserExceptionDto } from './dto/exception/already-exists-user.exception.dto';
import { CreateUserPayloadDto } from './dto/payload/create-user.payload.dto';
import { UpdateUserMePayloadDto } from './dto/payload/update-user-me.payload.dto';
import { UpdateUserCurrentOrganizationPayloadDto } from './dto/payload/update-user-organization.payload.dto';
import { UpdateUserSettingsPayloadDto } from './dto/payload/update-user-settings.payload.dto';
import { CreateUserResponseDto } from './dto/response/create-user.response.dto';
import { DeleteUserResponseDto } from './dto/response/delete-user.response.dto';
import { GetUserMeResponseDto } from './dto/response/get-user-me.response.dto';
import { GetUserSettingsResponseDto } from './dto/response/get-user-settings.response.dto';
import { UpdateUserMeResponseDto } from './dto/response/update-user-me.response.dto';
import { UpdateUserCurrentOrganizationResponseDto } from './dto/response/update-user-organization.response.dto';
import { UpdateUserSettingsResponseDto } from './dto/response/update-user-settings.response.dto';
import { UsersService } from './users.service';

@RequiredLogin
@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '사용자 생성' })
  @CombineResponses(HttpStatus.CREATED, CreateUserResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @CombineResponses(HttpStatus.CONFLICT, AlreadyExistsUserExceptionDto)
  @Transactional()
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserPayloadDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '사용자 조직 조회' })
  @CombineResponses(HttpStatus.OK, GetUserOrganizationsResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Get('me/organizations')
  async getUserOrganizations(@LoginUser() user: LoginUserData): Promise<GetUserOrganizationsResponseDto> {
    const userOrganizations = await this.usersService.getUserOrganizations(user.id);
    return new GetUserOrganizationsResponseDto(userOrganizations);
  }

  @ApiOperation({ summary: '사용자 조직 조회' })
  @CombineResponses(HttpStatus.OK, GetUserSettingsResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Get('me/settings')
  async getUserSettings(@LoginUser() user: LoginUserData): Promise<GetUserSettingsResponseDto> {
    const userSettings = await this.usersService.getUserSettings(user.id, user.provider);
    return new GetUserSettingsResponseDto(userSettings);
  }

  @ApiOperation({ summary: '사용자 정보 조회' })
  @CombineResponses(HttpStatus.OK, GetUserMeResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @Get('me')
  async findMe(@LoginUser() user: LoginUserData): Promise<GetUserMeResponseDto> {
    const getMe = await this.usersService.getMe(user.id, user.provider);
    return new GetUserMeResponseDto(getMe);
  }

  @ApiOperation({ summary: '사용자 정보 수정' })
  @CombineResponses(HttpStatus.OK, UpdateUserMeResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @Patch('me')
  async updateUserMe(@LoginUser() user: LoginUserData, @Body() updateUserMeDto: UpdateUserMePayloadDto): Promise<UpdateUserMeResponseDto> {
    await this.usersService.updateUserMe(user, updateUserMeDto);
    return new UpdateUserMeResponseDto();
  }

  @ApiOperation({ summary: '사용자 조직 조회' })
  @CombineResponses(HttpStatus.OK, GetUserOrganizationsResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @Patch('me/organizations')
  async updateUserCurrentOrganization(
    @LoginUser() user: LoginUserData,
    @Body() updateUserCurrentOrganizationDto: UpdateUserCurrentOrganizationPayloadDto,
  ): Promise<UpdateUserCurrentOrganizationResponseDto> {
    await this.usersService.updateUserCurrentOrganization(user.id, updateUserCurrentOrganizationDto.organizationId);
    return new UpdateUserCurrentOrganizationResponseDto();
  }

  @ApiOperation({ summary: '사용자 설정 수정' })
  @CombineResponses(HttpStatus.OK, UpdateUserSettingsResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Patch('me/settings')
  async updateUserSettings(
    @LoginUser() user: LoginUserData,
    @Body() updateUserSettingsDto: UpdateUserSettingsPayloadDto,
  ): Promise<UpdateUserSettingsResponseDto> {
    await this.usersService.updateUserSettings(user.id, updateUserSettingsDto.mailing);
    return new UpdateUserSettingsResponseDto();
  }

  @ApiOperation({ summary: '사용자 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteUserResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @Delete('me')
  async remove(@LoginUser() user: LoginUserData) {
    await this.usersService.softDeleteWithUserProviders(user);
    return new DeleteUserResponseDto();
  }
}
