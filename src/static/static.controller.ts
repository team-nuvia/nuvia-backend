import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { QueryGetProfileImageDto } from './dto/query-get-profile-image.dto';
import { NotFoundProfileImageException } from './exception/not-found-profile-image.exception';
import { GetProfileImageResponse } from './response/get-profile-image.response';
import { StaticService } from './static.service';

@ApiTags('정적 리소스')
@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @ApiOperation({ summary: '프로필 이미지 조회' })
  @CombineResponses(HttpStatus.OK, GetProfileImageResponse)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundProfileImageException)
  @Get('image/:profileFilename')
  async findAll(
    @Res() res: Response,
    @Query() query: QueryGetProfileImageDto,
    @Param('profileFilename') profileFilename: string,
  ) {
    const touchedBuffer = await this.staticService.findOneByFilename(
      res,
      query,
      profileFilename,
    );

    res.send(Buffer.from(touchedBuffer));
  }
}
