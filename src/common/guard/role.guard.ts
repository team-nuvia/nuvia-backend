import { ROLES_KEY } from '@common/variable/globals';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@share/enums/user-role';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    console.log('🚀 ~ RoleGuard ~ canActivate ~ requiredRoles:', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    if (!user.role) {
      throw new Error('사용자의 역할 정보가 없습니다.');
    }

    if (requiredRoles.length === 0) {
      return true;
    }

    console.log('🚀 ~ RoleGuard ~ canActivate ~ user.role:', user.role);
    if (!requiredRoles.includes(user.role)) {
      throw new Error('허용되지 않은 접근입니다.');
    }

    return true;
  }
}
