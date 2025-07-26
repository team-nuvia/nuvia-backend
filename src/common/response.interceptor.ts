import { LoggerService } from '@logger/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { serializeResponse } from '@util/serializeResponse';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
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
        const responseEntity = {
          ok: httpStatus < 300 && httpStatus >= 200,
          httpStatus,
          name: data.name,
          message: data.message ?? '응답 완료',
          reason: data.reason ?? null,
          payload: instanceToPlain(data.payload) ?? null,
        };

        const serialized = serializeResponse(responseEntity);

        this.loggerService.log(`⬅️ RES. [${method}] ${path} ${serialized.httpStatus}`);
        this.loggerService.log(JSON.stringify(serialized));

        if (req.body && Object.keys(req.body).length > 0) {
          this.loggerService.log(`⬅️ RES. [BODY] ${JSON.stringify(req.body, null)}`);
        }
        console.log('🚀 ~ ResponseInterceptor ~ intercept ~ serialized:', serialized);

        return serialized;
      }),
    );
  }
}
