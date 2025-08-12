import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { BadRequestException } from '@common/dto/response';
import { Controller, Delete, HttpStatus, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundProfileExceptionDto } from './dto/exception/not-found-profile.exception.dto';
import { CreateProfileResponseDto } from './dto/response/create-profile.response.dto';
import { DeleteProfileResponseDto } from './dto/response/delete-profile.response.dto';
import { UpdateProfileResponseDto } from './dto/response/update-profile.response.dto';
import { ProfilesService } from './profiles.service';
import { UploadFileInterceptor } from './upload-file.interceptor';

@RequiredLogin
@ApiTags('사용자 프로필')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: '프로필 생성' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @CombineResponses(HttpStatus.CREATED, CreateProfileResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @Post()
  @UseInterceptors(UploadFileInterceptor())
  create(@LoginUser() user: LoginUserData, @UploadedFile() file: Express.Multer.File) {
    console.log('🚀 ~ ProfilesController ~ create ~ file:', file);
    return this.profilesService.create(user.id, file);
  }

  // @ApiOperation({ summary: '프로필 조회' })
  // @CombineResponses(HttpStatus.OK, GetProfileResponse)
  // @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileExceptionDto)
  // @Get('me')
  // findOne(@LoginUser() user: LoginUserData) {
  //   return this.profilesService.findOne(user.id);
  // }

  @ApiOperation({ summary: '프로필 수정' })
  @CombineResponses(HttpStatus.OK, UpdateProfileResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileExceptionDto)
  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  update(@LoginUser() user: LoginUserData, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.update(user.id, file);
  }

  @ApiOperation({ summary: '프로필 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteProfileResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileExceptionDto)
  @Delete('me')
  remove(@LoginUser() user: LoginUserData) {
    return this.profilesService.remove(user.id);
  }
}
