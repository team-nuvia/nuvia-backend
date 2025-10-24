// metrics.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BlackListMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log(req.rawHeaders, req.ip);
    // if (DEFAULT_BLACK_LIST_IPS.includes(req.ip as IpAddress)) {
    //   throw new ForbiddenAccessExceptionDto();
    // }
    next();
  }
}
