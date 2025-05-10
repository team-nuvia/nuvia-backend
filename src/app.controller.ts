import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('앱')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('version')
  getVersion(): string {
    return this.appService.getVersion();
  }

  @Get('worker')
  worker(): string {
    return this.appService.getHello();
  }
}
