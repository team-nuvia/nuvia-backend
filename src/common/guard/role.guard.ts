import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { NoRoleInformationExceptionDto } from '@common/dto/exception/no-role-information.exception.dto';
import { ROLES_KEY } from '@common/variable/globals';
import { LoggerService } from '@logger/logger.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@share/enums/user-role';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly logger: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    if (!user?.role) {
      throw new NoRoleInformationExceptionDto();
    }

    this.logger.log(`user.role: ${user.role}`);
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenAccessExceptionDto();
    }

    return true;
  }
}
