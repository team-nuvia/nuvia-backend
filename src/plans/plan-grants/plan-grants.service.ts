import { Injectable } from '@nestjs/common';

@Injectable()
export class PlanGrantsService {
  findAll() {
    return `This action returns all planGrants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planGrant`;
  }
}
