import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { ApiDocs } from '@common/variable/dsl';
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '사용자 생성' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '사용자 정보 조회' })
  @Get('me')
  @CombineResponses(HttpStatus.OK, ApiDocs.DslUserMe)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundUser)
  @CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized)
  @RequiredLogin()
  findMe(@LoginUser() user: LoginUserData): Promise<User | null> {
    return this.usersService.findMe(user.id);
  }

  @ApiOperation({ summary: '사용자 정보 수정' })
  @Patch(':id')
  @RequiredLogin()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '사용자 삭제' })
  @Delete(':id')
  @RequiredLogin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
