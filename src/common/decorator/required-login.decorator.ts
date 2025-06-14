import { ApiDocs } from '@common/variable/dsl';
import { LoggerService } from '@logger/logger.service';
import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UtilService } from '@util/util.service';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RoleGuard } from '../role.guard';
import { UserRole } from '../variable/enums';
import { ROLES_KEY } from '../variable/globals';
import { CombineResponses } from './combine-responses.decorator';
import { PUBLIC_KEY } from './public.decorator';

export class RequiredLoginConstraint implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(UtilService)
    private readonly utilService: UtilService,
    @Inject(LoggerService)
    private readonly loggerService: LoggerService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const bearerToken = request.headers.authorization;

    if (!bearerToken || !bearerToken?.startsWith('Bearer')) {
      throw new ApiDocs.DslUnauthorized();
    }

    const token = bearerToken.slice(7);
    try {
      const isVerified = this.utilService.verifyJWT(token);
      return isVerified;
    } catch (error) {
      this.loggerService.debug('JWT 검증 에러:', error);
      return false;
    }
  }
}

export const RequiredLogin = (...roles: UserRole[]) =>
  applyDecorators(
    ApiBearerAuth(),
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RequiredLoginConstraint, RoleGuard),
    CombineResponses(HttpStatus.UNAUTHORIZED, ApiDocs.DslUnauthorized),
  );
