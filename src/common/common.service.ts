import { Injectable } from '@nestjs/common';
import { config } from '@config/index';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  getConfig<
    Keyword extends keyof typeof config,
    Result extends (typeof config)[Keyword],
  >(type: Keyword): ReturnType<Result> {
    return this.configService.get(type) as ReturnType<Result>;
  }
}
