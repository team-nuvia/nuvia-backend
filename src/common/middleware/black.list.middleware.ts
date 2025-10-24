// metrics.middleware.ts
import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { DEFAULT_BLACK_LIST_IPS } from '@common/variable/globals';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BlackListMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log(req.rawHeaders);
    if (DEFAULT_BLACK_LIST_IPS.includes(req.ip as IpAddress)) {
      throw new ForbiddenAccessExceptionDto();
    }
    next();
  }
}
