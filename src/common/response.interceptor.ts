import { LoggerService } from '@logger/logger.service';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { OkResponseDto } from './dto/response.dto';
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

    console.log('🚀 ~ ResponseInterceptor ~ intercept ~ req.body:', req.body);

    return next.handle().pipe(
      map((data) => {
        this.loggerService.log(`⬅️ RES. [${method}] ${path} ---`, data);

        return new OkResponseDto({
          ok: [HttpStatus.OK, HttpStatus.CREATED].includes(status),
          status,
          path,
          method,
          payload: data,
        });
      }),
    );
  }
}
