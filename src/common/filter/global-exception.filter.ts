import { LoggerService } from '@logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestMethod } from '../variable/enums';

@Catch()
export class GlobalExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception['status'] ?? 400);

    const message = exception.message ?? '서버 오류가 발생했습니다.';
    const reason: string | null = (exception.cause as string) ?? null;
    const errorResponse = {
      ok: false,
      status,
      path: req.originalUrl,
      method: req.method as RequestMethod,
      timestamp: new Date(),
      message,
      reason,
    };

    res.status(status).json(errorResponse);
    this.loggerService.error(
      `⬅️ RES. [${req.method}] ${req.originalUrl} ${status} ---`,
      `${message}${reason ? ` [${reason}]` : ''}`,
    );
    this.loggerService.error(
      `⬅️ RES.BODY. [${req.method}] ${req.originalUrl} ${status} ---`,
      JSON.stringify(req.body, null),
    );
    this.loggerService.error(
      `⬅️ RES.PAYLOAD. [${req.method}] ${req.originalUrl} ${status} ---`,
      JSON.stringify(errorResponse, null),
    );
  }
}
