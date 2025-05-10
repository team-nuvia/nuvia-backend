import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NumberRangeParsePipe implements PipeTransform<string, number> {
  transform(value: string): number {
    if (!isNaN(+value) && 0 < +value && +value <= 100) return +value;
    throw new BadRequestException('not allowed range');
  }
}
