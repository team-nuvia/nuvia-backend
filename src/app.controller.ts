import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Public } from '@common/decorator/public.decorator';
import { Controller, Get, Head, HttpStatus, Ip, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import client from 'prom-client';
import { AppService } from './app.service';
import { GetVersionResponse } from './responses';
import { GetHealthCheckResponseDto } from './util/dto/response/get-health-check.response.dto';

@Public()
@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '버전 조회' })
  @CombineResponses(HttpStatus.OK, GetVersionResponse)
  @Get('version')
  getVersion(@Ip() ipAddress: string, @Req() req: Request) {
    const version = this.appService.getVersion();
    console.log('decorator ipAddress:', ipAddress);
    console.log('req.ip:', req.ip);
    return new GetVersionResponse(version);
  }

  @ApiOperation({ summary: '헬스 체크' })
  @CombineResponses(HttpStatus.OK, GetHealthCheckResponseDto)
  @Head('health')
  getHealthCheck(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    return new GetHealthCheckResponseDto('OK');
  }

  @Get('metrics')
  async getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  }
}
