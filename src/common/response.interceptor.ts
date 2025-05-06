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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const status = response.statusCode;
    const path = request.originalUrl;
    const method = request.method as RequestMethod;

    return next.handle().pipe(
      map(
        (data) =>
          new OkResponseDto({
            ok: [HttpStatus.OK, HttpStatus.CREATED].includes(status),
            status,
            path,
            method,
            payload: data,
          }),
      ),
    );
  }
}
