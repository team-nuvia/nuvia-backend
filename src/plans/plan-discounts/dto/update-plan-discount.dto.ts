import { PartialType } from '@nestjs/swagger';
import { CreatePlanDiscountDto } from './create-plan-discount.dto';

export class UpdatePlanDiscountDto extends PartialType(CreatePlanDiscountDto) {}
