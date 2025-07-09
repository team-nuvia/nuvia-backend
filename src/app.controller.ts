import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SuccessResponseGetVersionDto } from './responses';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '버전 조회' })
  @CombineResponses(HttpStatus.OK, SuccessResponseGetVersionDto)
  @Get('version')
  getVersion() {
    const version = this.appService.getVersion();

    return new SuccessResponseGetVersionDto(version);
  }
}
