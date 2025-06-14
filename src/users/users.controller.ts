import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { InputValidationPipe } from '@common/decorator/input-validate-pipe.decorator';
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
import { BodyCreateUserDto } from './dto/body-create-user.dto';
import { BodyUpdateUserDto } from './dto/body-update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '사용자 생성' })
  @Post()
  @CombineResponses(HttpStatus.CREATED, ApiDocs.DslCreateUser)
  @CombineResponses(HttpStatus.BAD_REQUEST, ApiDocs.DslBadRequest)
  @CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized)
  create(
    @Body(InputValidationPipe())
    createUserDto: BodyCreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '사용자 정보 조회' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslUserMe)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundUser)
  @CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized)
  @Get('me')
  @RequiredLogin()
  findMe(@LoginUser() user: LoginUserData): Promise<User | null> {
    return this.usersService.findMe(user.id);
  }

  @ApiOperation({ summary: '사용자 정보 수정' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslUpdateUser)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundUser)
  @CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized)
  @Patch(':id')
  @RequiredLogin()
  update(@Param('id') id: string, @Body() updateUserDto: BodyUpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '사용자 삭제' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslDeleteUser)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundUser)
  @CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized)
  @Delete(':id')
  @RequiredLogin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
