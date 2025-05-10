import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @RequiredLogin()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.create(user.id, file);
  }

  @Get('me')
  @RequiredLogin()
  findOne(@LoginUser() user: LoginUserData) {
    return this.profilesService.findOne(user.id);
  }

  @Patch('me')
  @RequiredLogin()
  @UseInterceptors(FileInterceptor('file'))
  update(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.update(user.id, file);
  }

  @Delete('me')
  @RequiredLogin()
  remove(@LoginUser() user: LoginUserData) {
    return this.profilesService.remove(user.id);
  }
}
