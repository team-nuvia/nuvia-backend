import { LoggerService } from '@logger/logger.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, _res: any, next: () => void) {
    this.loggerService.log(`➡️ REQ. [${req.method}] ${req.originalUrl} Content-Type: ${req.headers['content-type']} Cookies: ${req.headers['cookie']}`);

    if (req.body && Object.keys(req.body).length > 0) {
      this.loggerService.log(`➡️ REQ. [BODY] ${JSON.stringify(req.body, null)}`);
    }

    next();
  }
}
