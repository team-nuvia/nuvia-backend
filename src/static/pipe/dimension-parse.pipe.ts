import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isNil } from '@util/isNil';

@Injectable()
export class DimensionParsePipe
  implements PipeTransform<string, { width: number; height: number } | null>
{
  transform(value: string): { width: number; height: number } | null {
    if (isNil(value)) {
      return null;
    }

    if (!value.includes('x')) {
      throw new BadRequestException('not allowed type');
    }

    const [width, height] = value.split('x');

    if (isNaN(+width) || isNaN(+height)) {
      throw new BadRequestException('dimension only number');
    }

    return { width: +width, height: +height };
  }
}
