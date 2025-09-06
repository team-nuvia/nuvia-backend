import { TZDate } from '@date-fns/tz';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isPastThanNextDay', async: true })
export class IsPastThanNextDayConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!value) return true; // null 값은 허용

    const now = new Date();
    const kstNow = new TZDate(now, 'Asia/Seoul');

    // 한국 시간 기준 다음날 00:00:00
    const kstNextDay = new TZDate(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate() + 1, 'Asia/Seoul');

    // 다시 UTC로 변환
    const utcNextDay = new TZDate(kstNextDay, 'UTC');
    const inputDate = new Date(value);
    return inputDate >= utcNextDay;
  }

  defaultMessage() {
    return `만료 일시는 최소 다음날 00시(한국시간)부터 가능합니다`;
  }
}

export function IsPastThanNextDay(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [],
      validator: IsPastThanNextDayConstraint,
    });
  };
}
