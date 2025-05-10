import { LoggerService } from '@logger/logger.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, _res: any, next: () => void) {
    this.loggerService.log(`➡️ REQ. [${req.method}] ${req.originalUrl}`);
    next();
  }
}
