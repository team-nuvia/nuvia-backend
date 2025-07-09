import { SuccessResponseUserMeDto } from '@/responses';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { InputValidationPipe } from '@common/decorator/input-validate-pipe.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import {
  BadRequestResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '@common/dto/global-response.dto';
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
import { SuccessResponseCreateUserDto } from '@user-secrets/dto/success-response-create-user.dto';
import { BodyCreateUserDto } from './dto/body-create-user.dto';
import { BodyUpdateUserDto } from './dto/body-update-user.dto';
import { SuccessResponseUpdateUserDto } from './dto/success-reesponse-update-user.dto';
import { SuccessResponseDeleteUserDto } from './dto/success-response-delete-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '사용자 생성' })
  @Post()
  @CombineResponses(HttpStatus.CREATED, SuccessResponseCreateUserDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestResponseDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedResponseDto)
  create(
    @Body(InputValidationPipe())
    createUserDto: BodyCreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '사용자 정보 조회' })
  @CombineResponses(HttpStatus.OK, SuccessResponseUserMeDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundResponseDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedResponseDto)
  @Get('me')
  @RequiredLogin()
  findMe(@LoginUser() user: LoginUserData): Promise<User | null> {
    return this.usersService.findMe(user.id);
  }

  @ApiOperation({ summary: '사용자 정보 수정' })
  @CombineResponses(HttpStatus.OK, SuccessResponseUpdateUserDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundResponseDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedResponseDto)
  @Patch(':id')
  @RequiredLogin()
  update(@Param('id') id: string, @Body() updateUserDto: BodyUpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '사용자 삭제' })
  @CombineResponses(HttpStatus.OK, SuccessResponseDeleteUserDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundResponseDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedResponseDto)
  @Delete(':id')
  @RequiredLogin()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
