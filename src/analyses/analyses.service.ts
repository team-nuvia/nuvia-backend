import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysesService {
  findAll() {
    return `This action returns all analyses`;
  }
}
