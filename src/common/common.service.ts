import { config } from '@config/index';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  getConfig<Keyword extends keyof typeof config, Result extends (typeof config)[Keyword]>(type: Keyword): ReturnType<Result> {
    return this.configService.get(type) as ReturnType<Result>;
  }

  createJwtOptions(): JwtModuleOptions {
    const secret = this.getConfig('secret').jwt;
    return {
      secret,
      verifyOptions: {
        issuer: 'custom',
        algorithms: ['HS256'],
      },
    };
  }
}
