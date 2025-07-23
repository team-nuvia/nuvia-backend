import { ROLES_KEY } from '@common/variable/globals';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@share/enums/user-role';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
