import {
  BadRequestException,
  BaseException,
  ConflictException,
  ErrorKey,
  ForbiddenException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@common/dto/response';
import { LoggerService } from '@logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  BadRequestException as NestBadRequestException,
  ConflictException as NestConflictException,
  ForbiddenException as NestForbiddenException,
  MethodNotAllowedException as NestMethodNotAllowedException,
  NotFoundException as NestNotFoundException,
  UnauthorizedException as NestUnauthorizedException,
} from '@nestjs/common';
import { serializeResponse } from '@util/serializeResponse';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter<T extends BaseException> implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  private handleException(exception: BaseException) {
    const { name, httpStatus, message, reason, payload } = exception;
    const errorResponse: IBaseResponse<null> = {
      ok: false,
      httpStatus,
      name,
      message,
      reason,
      payload,
    };
    const serialized = serializeResponse(errorResponse);
    return serialized;
  }

  private printLog(req: Request, serialized: IBaseResponse<null>) {
    this.loggerService.error(
      `⬅️ RES. [${req.method}] ${req.originalUrl} ${serialized.httpStatus} --- ${serialized.message}${serialized.reason ? ` [${serialized.reason}]` : ''}`,
    );

    this.loggerService.error(`⬅️ RES.BODY. [${req.method}] ${req.originalUrl} ${serialized.httpStatus} --- ${JSON.stringify(req.body, null)}`);

    this.loggerService.error(`⬅️ RES.PAYLOAD. [${req.method}] ${req.originalUrl} ${serialized.httpStatus} --- ${JSON.stringify(serialized, null)}`);
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException || exception instanceof NestBadRequestException) {
      const errorResponse = this.handleException(exception);
      res.status(errorResponse.httpStatus).json(errorResponse);
      const serialized = serializeResponse(errorResponse);
      this.printLog(req, serialized);
      return;
    } else if (exception instanceof UnauthorizedException || exception instanceof NestUnauthorizedException) {
      const errorResponse = this.handleException(exception);
      res.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
      const serialized = serializeResponse(errorResponse);
      this.printLog(req, serialized);
      return;
    } else if (exception instanceof ForbiddenException || exception instanceof NestForbiddenException) {
      const errorResponse = this.handleException(exception);
      res.status(HttpStatus.FORBIDDEN).json(errorResponse);
      const serialized = serializeResponse(errorResponse);
      this.printLog(req, serialized);
      return;
    } else if (exception instanceof NotFoundException || exception instanceof NestNotFoundException) {
      const errorResponse = this.handleException(exception);
      res.status(HttpStatus.NOT_FOUND).json(errorResponse);
      const serialized = serializeResponse(errorResponse);
      this.printLog(req, serialized);
      return;
    } else if (exception instanceof MethodNotAllowedException || exception instanceof NestMethodNotAllowedException) {
      const errorResponse = this.handleException(exception);
      res.status(HttpStatus.METHOD_NOT_ALLOWED).json(errorResponse);
      const serialized = serializeResponse(errorResponse);
      this.printLog(req, serialized);
      return;
    } else if (exception instanceof ConflictException || exception instanceof NestConflictException) {
      const errorResponse = this.handleException(exception);
      res.status(HttpStatus.CONFLICT).json(errorResponse);
      const serialized = serializeResponse(errorResponse);
      this.printLog(req, serialized);
      return;
    }

    const errorResponse = this.handleException(
      new InternalServerErrorException({
        code: ErrorKey.INTERNAL_SERVER_ERROR,
        reason: exception.message ?? '서버 오류가 발생했습니다.',
      }),
    );
    errorResponse.message = exception.message ?? '서버 오류가 발생했습니다.';

    const serialized = serializeResponse(errorResponse);
    this.printLog(req, serialized);

    res.status(serialized.httpStatus).json(serialized);
  }
}
