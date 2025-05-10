import { LoggerService } from '@logger/logger.service';
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
  FactoryErrorResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '../dto/response.dto';
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
      exception instanceof HttpException ? exception.getStatus() : 500;

    let ExceptionDto: ReturnType<typeof FactoryErrorResponseDto>;
    switch (true) {
      case exception instanceof BadRequestException: {
        ExceptionDto = BadRequestResponseDto;
        break;
      }
      case exception instanceof UnauthorizedException: {
        ExceptionDto = UnauthorizedResponseDto;
        break;
      }
      case exception instanceof NotFoundException: {
        ExceptionDto = NotFoundResponseDto;
        break;
      }
      case exception instanceof ConflictException: {
        ExceptionDto = ConflictResponseDto;
        break;
      }
      default: {
        ExceptionDto = BadRequestResponseDto;
        break;
      }
    }

    const message = exception.message ?? '서버 오류가 발생했습니다.';
    const detail = exception.cause as string;
    const errorResponse = new ExceptionDto({
      ok: false,
      status,
      path: req.originalUrl,
      method: req.method as RequestMethod,
      message,
      detail,
    });

    res.status(status).json(errorResponse);
    this.loggerService.error(
      `⬅️ RES. [${req.method}] ${req.originalUrl} ---`,
      message,
    );

    // if (exception instanceof BadRequestException) {
    //   const message = exception.message;
    //   const detail = exception.cause as string;
    //   const errorResponse = new BadRequestResponseDto({
    //     ok: false,
    //     status,
    //     path: request.originalUrl,
    //     method: request.method as RequestMethod,
    //     message,
    //     detail,
    //   });
    //   response.status(status).json(errorResponse);
    //   return;
    // }

    // if (exception instanceof UnauthorizedException) {
    //   const message = exception.message;
    //   const detail = exception.cause as string;
    //   const errorResponse = new UnauthorizedResponseDto({
    //     ok: false,
    //     status,
    //     path: request.originalUrl,
    //     method: request.method as RequestMethod,
    //     message,
    //     detail,
    //   });
    //   response.status(status).json(errorResponse);
    //   return;
    // }

    // if (exception instanceof NotFoundException) {
    //   const message = exception.message;
    //   const detail = exception.cause as string;
    //   const errorResponse = new NotFoundResponseDto({
    //     ok: false,
    //     status,
    //     path: request.originalUrl,
    //     method: request.method as RequestMethod,
    //     message,
    //     detail,
    //   });
    //   response.status(status).json(errorResponse);
    //   return;
    // }

    // if (exception instanceof ConflictException) {
    //   const message = exception.message;
    //   const detail = exception.cause as string;
    //   const errorResponse = new ConflictResponseDto({
    //     ok: false,
    //     status,
    //     path: request.originalUrl,
    //     method: request.method as RequestMethod,
    //     message,
    //     detail,
    //   });
    //   response.status(status).json(errorResponse);
    //   return;
    // }

    // const errorResponse = new BadRequestResponseDto({
    //   ok: false,
    //   status,
    //   path: request.originalUrl,
    //   method: request.method as RequestMethod,
    //   message: '서버 오류가 발생했습니다.',
    // });
    // response.status(status).json(errorResponse);
  }
}
