import { Injectable } from '@nestjs/common';

@Injectable()
export class PlanGrantsService {
  findAll(planId: string) {
    return `This action returns all planGrants for plan ${planId}`;
  }
}
