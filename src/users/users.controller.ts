import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@common/dto/response/exception.interface';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BodyCreateUserDto } from './dto/body-create-user.dto';
import { BodyUpdateUserDto } from './dto/body-update-user.dto';
import { User } from './entities/user.entity';
import { AlreadyExistsUserException } from './exception/already-exists-user.exception';
import { CreateUserResponse } from './response/create-user.response';
import { DeleteUserResponse } from './response/delete-user.response';
import { GetUserMeResponse } from './response/get-user-me.response';
import { UpdateUserResponse } from './response/update-user.response';
import { UsersService } from './users.service';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '사용자 생성' })
  @Post()
  @CombineResponses(HttpStatus.CREATED, CreateUserResponse)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @CombineResponses(HttpStatus.CONFLICT, AlreadyExistsUserException)
  create(@Body() createUserDto: BodyCreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '사용자 정보 조회' })
  @CombineResponses(HttpStatus.OK, GetUserMeResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundUserException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Get('me')
  @RequiredLogin()
  findMe(@LoginUser() user: LoginUserData): Promise<User | null> {
    return this.usersService.findMe(user.id);
  }

  @ApiOperation({ summary: '사용자 정보 수정' })
  @CombineResponses(HttpStatus.OK, UpdateUserResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Patch(':id')
  @RequiredLogin()
  update(@Param('id') id: string, @Body() updateUserDto: BodyUpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '사용자 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteUserResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Delete(':id')
  @RequiredLogin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
