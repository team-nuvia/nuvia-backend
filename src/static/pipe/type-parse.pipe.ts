import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TypeParsePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (['p', 'd'].includes(value)) return value;
    throw new BadRequestException('not allowed type');
  }
}
