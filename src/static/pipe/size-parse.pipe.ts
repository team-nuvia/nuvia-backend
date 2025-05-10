import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SizeParsePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (['small', 'medium', 'origin'].includes(value)) return value;
    throw new BadRequestException('not allowed size');
  }
}
