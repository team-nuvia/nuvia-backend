import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '../dto/response.dto';
import { RequestMethod } from '../variable/enums';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception instanceof BadRequestException) {
      const message = exception.message;
      const detail = exception.cause as string;
      const errorResponse = new BadRequestResponseDto({
        ok: false,
        status,
        path: request.originalUrl,
        method: request.method as RequestMethod,
        message,
        detail,
      });
      response.status(status).json(errorResponse);
      return;
    }

    if (exception instanceof UnauthorizedException) {
      const message = exception.message;
      const detail = exception.cause as string;
      const errorResponse = new UnauthorizedResponseDto({
        ok: false,
        status,
        path: request.originalUrl,
        method: request.method as RequestMethod,
        message,
        detail,
      });
      response.status(status).json(errorResponse);
      return;
    }

    if (exception instanceof NotFoundException) {
      const message = exception.message;
      const detail = exception.cause as string;
      const errorResponse = new NotFoundResponseDto({
        ok: false,
        status,
        path: request.originalUrl,
        method: request.method as RequestMethod,
        message,
        detail,
      });
      response.status(status).json(errorResponse);
      return;
    }

    if (exception instanceof ConflictException) {
      const message = exception.message;
      const detail = exception.cause as string;
      const errorResponse = new ConflictResponseDto({
        ok: false,
        status,
        path: request.originalUrl,
        method: request.method as RequestMethod,
        message,
        detail,
      });
      response.status(status).json(errorResponse);
      return;
    }

    const errorResponse = new BadRequestResponseDto({
      ok: false,
      status,
      path: request.originalUrl,
      method: request.method as RequestMethod,
      message: '서버 오류가 발생했습니다.',
    });
    response.status(status).json(errorResponse);
  }
}
