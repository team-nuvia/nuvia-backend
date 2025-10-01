import { Injectable } from '@nestjs/common';
import { PlansRepository } from './plans.repository';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  findAll() {
    return this.plansRepository.findAll();
  }

  findOne(id: number) {
    return this.plansRepository.findOne(id);
  }
}
