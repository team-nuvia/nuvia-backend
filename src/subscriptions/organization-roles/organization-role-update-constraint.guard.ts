import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { ValidateActionType } from '@common/variable/enums/validate-action-type.enum';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { UtilRepository } from '@util/util.repository';

@Injectable()
export class OrganizationRoleUpdateConstraintGuard implements CanActivate {
  constructor(private readonly utilRepository: UtilRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const subscription = await this.utilRepository.getCurrentOrganization(user.id);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 권한 검증 */
    this.utilRepository.organizationRolePermissionGrantsValidation(subscription, ValidateActionType.Update);

    return true;
  }
}

export const OrganizationRoleUpdateConstraintValidation = () => applyDecorators(UseGuards(OrganizationRoleUpdateConstraintGuard));
