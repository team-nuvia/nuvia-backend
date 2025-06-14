import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { ApiDocs } from '@common/variable/dsl';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '버전 조회' })
  @CombineResponses(HttpStatus.OK, ApiDocs.DslGetVersion)
  @Get('version')
  getVersion(): string {
    return this.appService.getVersion();
  }
}
