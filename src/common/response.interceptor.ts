import { LoggerService } from '@logger/logger.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RequestMethod } from './variable/enums';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const httpStatus = res.statusCode;
    const path = req.originalUrl;
    const method = req.method as RequestMethod;

    return next.handle().pipe(
      map((data) => {
        console.log('🚀 ~ ResponseInterceptor ~ map ~ data:', data);
        this.loggerService.log(
          `⬅️ RES. [${method}] ${path} ${httpStatus} ---`,
          data,
        );
        this.loggerService.log(
          `⬅️ RES.BODY. [${method}] ${path} ${httpStatus} ---`,
          JSON.stringify(req.body, null),
        );

        // return new SuccessResponseDto({
        //   ok: httpStatus < 300 && httpStatus >= 200,
        //   httpStatus,
        //   path,
        //   method,
        //   timestamp: new Date(),
        //   payload: data,
        //   message: data.message ?? '응답 완료',
        //   reason: data.reason ?? null,
        // });
        return instanceToPlain(data);
        // return data;
      }),
      catchError((err) => {
        this.loggerService.error(
          `⬅️ RES. [${method}] ${path} ${httpStatus} ---`,
          err,
        );
        this.loggerService.error(
          `⬅️ RES.BODY. [${method}] ${path} ${httpStatus} ---`,
          JSON.stringify(req.body, null),
        );
        this.loggerService.error(
          `⬅️ RES.PAYLOAD. [${method}] ${path} ${httpStatus} ---`,
          JSON.stringify(err, null),
        );
        return throwError(() => err);
      }),
    );
  }
}
