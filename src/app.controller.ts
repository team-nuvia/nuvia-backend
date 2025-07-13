import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetVersionResponse } from './responses';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '버전 조회' })
  @CombineResponses(HttpStatus.OK, GetVersionResponse)
  @Get('version')
  getVersion() {
    const version = this.appService.getVersion();

    return new GetVersionResponse(version);
  }
}
