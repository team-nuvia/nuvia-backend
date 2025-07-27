import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { PassRoles } from '@common/decorator/pass-roles.decorator';
import { Public } from '@common/decorator/public.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@common/dto/response/exception.interface';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@share/enums/user-role';
import { AlreadyExistsUserExceptionDto } from './dto/exception/already-exists-user.exception.dto';
import { CreateUserPayloadDto } from './dto/payload/create-user.payload.dto';
import { UpdateUserPayloadDto } from './dto/payload/update-user.payload.dto';
import { CreateUserResponseDto } from './response/create-user.response.dto';
import { DeleteUserResponseDto } from './response/delete-user.response.dto';
import { GetUserMeResponseDto } from './response/get-user-me.response.dto';
import { UpdateUserResponseDto } from './response/update-user.response.dto';
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
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserPayloadDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '사용자 정보 조회' })
  @CombineResponses(HttpStatus.OK, GetUserMeResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Get('me')
  @PassRoles(UserRole.User)
  async findMe(@LoginUser() user: LoginUserData): Promise<GetUserMeResponseDto> {
    console.log('🚀 ~ UsersController ~ findMe ~ user:', user);
    const getMe = await this.usersService.findMe(user.id);
    return new GetUserMeResponseDto(getMe);
  }

  @ApiOperation({ summary: '사용자 정보 수정' })
  @CombineResponses(HttpStatus.OK, UpdateUserResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserPayloadDto) {
    await this.usersService.update(+id, updateUserDto);
    return new UpdateUserResponseDto();
  }

  @ApiOperation({ summary: '사용자 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteUserResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return new DeleteUserResponseDto();
  }
}
