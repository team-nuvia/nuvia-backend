import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProfileResponse } from './dto/create-profile.response';
import { DeleteProfileResponse } from './dto/delete-profile.response';
import { GetProfileResponse } from './dto/get-profile.response';
import { UpdateProfileResponse } from './dto/update-profile.response';
import { ProfilesService } from './profiles.service';
import { NotFoundProfileException } from './resopnse/not-found-profile.exception';

@ApiTags('프로필')
@RequiredLogin()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: '프로필 생성' })
  @CombineResponses(HttpStatus.CREATED, CreateProfileResponse)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.create(user.id, file);
  }

  @ApiOperation({ summary: '프로필 조회' })
  @CombineResponses(HttpStatus.OK, GetProfileResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileException)
  @Get('me')
  findOne(@LoginUser() user: LoginUserData) {
    return this.profilesService.findOne(user.id);
  }

  @ApiOperation({ summary: '프로필 수정' })
  @CombineResponses(HttpStatus.OK, UpdateProfileResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileException)
  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.update(user.id, file);
  }

  @ApiOperation({ summary: '프로필 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteProfileResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileException)
  @Delete('me')
  remove(@LoginUser() user: LoginUserData) {
    return this.profilesService.remove(user.id);
  }
}
