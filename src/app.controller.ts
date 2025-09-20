import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Public } from '@common/decorator/public.decorator';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import client from 'prom-client';
import { AppService } from './app.service';
import { GetVersionResponse } from './responses';

@Public()
@ApiTags('앱')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @ApiOperation({ summary: '버전 조회' })
  @CombineResponses(HttpStatus.OK, GetVersionResponse)
  @Get('version')
  getVersion() {
    const version = this.appService.getVersion();

    return new GetVersionResponse(version);
  }

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  }
}
