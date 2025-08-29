import { PickType } from '@nestjs/swagger';
import { CreateOrganizationRolePayloadDto } from './create-organization-role.payload.dto';

export class UpdateOrganizationRolePayloadDto extends PickType(CreateOrganizationRolePayloadDto, ['role', 'status']) {}
