import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ResponseTypeParsePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (['jpg', 'jpeg', 'webp', 'png'].includes(value)) return value;
    throw new BadRequestException('not allowed type');
  }
}
