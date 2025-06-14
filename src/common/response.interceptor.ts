import { LoggerService } from '@logger/logger.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { SuccessResponseDto } from './dto/global-response.dto';
import { RequestMethod } from './variable/enums';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const status = res.statusCode;
    const path = req.originalUrl;
    const method = req.method as RequestMethod;

    return next.handle().pipe(
      map((data) => {
        this.loggerService.log(
          `⬅️ RES. [${method}] ${path} ${status} ---`,
          data,
        );
        this.loggerService.log(
          `⬅️ RES.BODY. [${method}] ${path} ${status} ---`,
          JSON.stringify(req.body, null),
        );

        return new SuccessResponseDto({
          ok: status < 300 && status >= 200,
          status,
          path,
          method,
          timestamp: new Date(),
          payload: data,
          message: data.message ?? null,
        });
      }),
    );
  }
}
