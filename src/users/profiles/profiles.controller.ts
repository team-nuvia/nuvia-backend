import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import {
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
import { ProfilesService } from './profiles.service';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { ApiDocs } from '@common/variable/dsl';

@ApiTags('프로필')
@RequiredLogin()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: '프로필 생성' })
  @CombineResponses(HttpStatus.CREATED, ApiDocs.DslCreateProfile)
  @CombineResponses(HttpStatus.BAD_REQUEST, ApiDocs.DslBadRequest)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.create(user.id, file);
  }

  @ApiOperation({ summary: '프로필 조회' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslGetProfile)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundProfile)
  @Get('me')
  findOne(@LoginUser() user: LoginUserData) {
    return this.profilesService.findOne(user.id);
  }

  @ApiOperation({ summary: '프로필 수정' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslUpdateProfile)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundProfile)
  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.update(user.id, file);
  }

  @ApiOperation({ summary: '프로필 삭제' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslDeleteProfile)
  @CombineResponses(HttpStatus.NOT_FOUND, ApiDocs.DslNotFoundProfile)
  @Delete('me')
  remove(@LoginUser() user: LoginUserData) {
    return this.profilesService.remove(user.id);
  }
}
