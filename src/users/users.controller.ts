import {
  ApiErrorResponses,
  ApiOkResponses,
} from '@common/decorator/api-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import {
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '@common/dto/response.dto';
import { RequestMethod } from '@common/variable/enums';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @ApiOkResponses(
    {
      status: HttpStatus.OK,
      method: RequestMethod.GET,
      path: '/users/me',
      description: '사용자 정보 조회',
    },
    [User],
  )
  @ApiErrorResponses(
    {
      status: HttpStatus.NOT_FOUND,
      method: RequestMethod.GET,
      path: '/users/me',
      description: '사용자를 찾기 실패',
      message: '사용자를 찾지 못했습니다.',
    },
    NotFoundResponseDto,
  )
  @ApiErrorResponses(
    {
      status: HttpStatus.UNAUTHORIZED,
      method: RequestMethod.GET,
      path: '/users/me',
      description: '사용자를 찾기 실패',
      message: '사용자를 찾지 못했습니다.',
    },
    UnauthorizedResponseDto,
  )
  @RequiredLogin()
  findMe(@LoginUser() user: LoginUserData): Promise<User | null> {
    return this.usersService.findMe(user.id);
  }

  @Patch(':id')
  @RequiredLogin()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @RequiredLogin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
