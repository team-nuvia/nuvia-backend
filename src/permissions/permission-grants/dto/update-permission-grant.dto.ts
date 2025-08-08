import { PartialType } from '@nestjs/swagger';
import { CreatePermissionGrantDto } from './create-permission-grant.dto';

export class UpdatePermissionGrantDto extends PartialType(CreatePermissionGrantDto) {}
