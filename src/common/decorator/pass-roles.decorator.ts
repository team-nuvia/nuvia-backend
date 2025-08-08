import { RoleGuard } from '@common/guard/role.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@share/enums/user-role';
import { Roles } from './roles.decorator';

export const PassRoles = (roles?: UserRole[]) => applyDecorators(Roles(roles), UseGuards(RoleGuard));
