import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserPayloadDto } from './create-user.payload.dto';

export class UpdateUserPayloadDto extends PartialType(OmitType(CreateUserPayloadDto, ['password'])) {}
