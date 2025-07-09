import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import {
  BadRequestResponseDto,
  NotFoundResponseDto,
} from '@common/dto/global-response.dto';
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
import { SuccessResponseCreateProfileDto } from './dto/success-response-create-profile.dto';
import { SuccessResponseDeleteProfileDto } from './dto/success-response-delete-profile.dto';
import { SuccessResponseGetProfileDto } from './dto/success-response-get-profile.dto';
import { SuccessResponseUpdateProfileDto } from './dto/success-response-update-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('프로필')
@RequiredLogin()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: '프로필 생성' })
  @CombineResponses(HttpStatus.CREATED, SuccessResponseCreateProfileDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestResponseDto)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.create(user.id, file);
  }

  @ApiOperation({ summary: '프로필 조회' })
  @CombineResponses(HttpStatus.OK, SuccessResponseGetProfileDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundResponseDto)
  @Get('me')
  findOne(@LoginUser() user: LoginUserData) {
    return this.profilesService.findOne(user.id);
  }

  @ApiOperation({ summary: '프로필 수정' })
  @CombineResponses(HttpStatus.OK, SuccessResponseUpdateProfileDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundResponseDto)
  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @LoginUser() user: LoginUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.update(user.id, file);
  }

  @ApiOperation({ summary: '프로필 삭제' })
  @CombineResponses(HttpStatus.OK, SuccessResponseDeleteProfileDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundResponseDto)
  @Delete('me')
  remove(@LoginUser() user: LoginUserData) {
    return this.profilesService.remove(user.id);
  }
}
