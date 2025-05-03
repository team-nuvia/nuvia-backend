import { PartialType } from '@nestjs/swagger';
import { CreateUserSecretDto } from './create-user-secret.dto';

export class UpdateUserSecretDto extends PartialType(CreateUserSecretDto) {}
