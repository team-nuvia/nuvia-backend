import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { ROLES_KEY } from '@common/variable/globals';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@share/enums/user-role';
import { UtilRepository } from '@util/util.repository';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly utilRepository: UtilRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();

    const subscription = await this.utilRepository.getCurrentOrganization(user.id);

    if (!requiredRoles.includes(subscription.permission.role)) {
      throw new ForbiddenAccessExceptionDto();
    }

    return true;
  }
}
