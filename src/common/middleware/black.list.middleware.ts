// metrics.middleware.ts
import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { calculateIpRange } from '@util/calculateIpRange';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BlackListMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const clientIp = req.ip as IpAddress;

    // get other headers ips
    // Check for commonly used headers for real IP in case client is behind proxy
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIpHeader = req.headers['x-real-ip'];
    let headerIps: string[] = [];

    if (typeof forwardedFor === 'string') {
      headerIps = forwardedFor.split(',').map((ip) => ip.trim());
    } else if (Array.isArray(forwardedFor)) {
      headerIps = forwardedFor.map((ip) => ip.trim());
    }

    if (realIpHeader && typeof realIpHeader === 'string') {
      headerIps.push(realIpHeader.trim());
    }
    // Now headerIps contains the list of IPs from headers (if any)

    const realIp = headerIps.length > 0 ? (headerIps[0] as IpAddress) : clientIp;

    /* ip 범위 계산 */
    calculateIpRange(realIp);

    if (!realIp) {
      throw new ForbiddenAccessExceptionDto();
    }

    req.realIp = realIp;

    next();
  }
}
