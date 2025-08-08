import { PartialType } from '@nestjs/swagger';
import { CreatePlanGrantDto } from './create-plan-grant.dto';

export class UpdatePlanGrantDto extends PartialType(CreatePlanGrantDto) {}
