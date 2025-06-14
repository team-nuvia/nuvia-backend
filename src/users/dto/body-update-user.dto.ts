import { OmitType, PartialType } from '@nestjs/swagger';
import { BodyCreateUserDto } from './body-create-user.dto';

export class BodyUpdateUserDto extends PartialType(
  OmitType(BodyCreateUserDto, ['password']),
) {}
