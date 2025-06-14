import { PartialType } from '@nestjs/swagger';
import { CreateErrorCodeDto } from './create-error-code.dto';

export class UpdateErrorCodeDto extends PartialType(CreateErrorCodeDto) {}
