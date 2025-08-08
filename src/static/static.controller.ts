import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotFoundProfileExceptionDto } from '@users/profiles/dto/exception/not-found-profile.exception.dto';
import { Response } from 'express';
import { NotFoundProfileImageDto } from './dto/exception/not-found-profile-image.exception.dto';
import { SizeOverExceptionDto } from './dto/exception/size-over.exception.dto';
import { QueryGetProfileImagePayloadDto } from './dto/payload/query-get-profile-image.payload.dto';
import { GetProfileImageResponse } from './dto/response/get-profile-image.response';
import { StaticService } from './static.service';

@ApiTags('정적 리소스')
@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @ApiOperation({ summary: '프로필 이미지 조회' })
  @CombineResponses(HttpStatus.OK, GetProfileImageResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileImageDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, SizeOverExceptionDto, NotFoundProfileExceptionDto)
  @Get('image/:profileFilename')
  async findAll(@Res() res: Response, @Query() query: QueryGetProfileImagePayloadDto, @Param('profileFilename') profileFilename: string) {
    const touchedBuffer = await this.staticService.findOneByFilename(res, query, profileFilename);

    res.send(Buffer.from(touchedBuffer));
  }
}
