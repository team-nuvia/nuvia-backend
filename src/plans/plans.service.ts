import { Injectable } from '@nestjs/common';

@Injectable()
export class PlansService {
  findAll() {
    return `This action returns all plans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }
}
