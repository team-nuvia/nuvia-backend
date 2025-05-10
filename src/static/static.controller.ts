import {
  Controller,
  Get,
  Optional,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AvailableFormatInfo, FormatEnum } from 'sharp';
import { DimensionParsePipe } from './pipe/dimension-parse.pipe';
import { NumberRangeParsePipe } from './pipe/number-range-parse.pipe';
import { ResponseTypeParsePipe } from './pipe/response-type-parse.pipe';
import { TypeParsePipe } from './pipe/type-parse.pipe';
import { StaticService } from './static.service';

@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('image/:profileFilename')
  async findAll(
    @Res() res: Response,
    @Query('t', TypeParsePipe) type: string,
    @Query('q', ParseIntPipe, NumberRangeParsePipe) quality: number,
    @Optional()
    @Query('d', DimensionParsePipe)
    dimension: { width: number; height: number } | null,
    @Query('rs', ResponseTypeParsePipe)
    responseType: keyof FormatEnum | AvailableFormatInfo,
    @Param('profileFilename') profileFilename: string,
  ) {
    const touchedBuffer = await this.staticService.findOneByFilename(res, {
      type,
      dimension,
      quality,
      responseType,
      profileFilename,
    });

    res.send(Buffer.from(touchedBuffer));
  }
}
