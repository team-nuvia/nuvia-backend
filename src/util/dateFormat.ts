export class DateFormat {
  static convert(format: string = 'YYYY-MM-dd HH:mm:ss.SSS', baseTime: string | number | Date = new Date()) {
    const base = new Date(baseTime);
    return format.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP|YY|M|d|H|m|s|S/g, (match: string) => {
      switch (match) {
        case 'YYYY':
          return base.getFullYear().toString().padStart(4, '0');
        case 'MM':
          return (base.getMonth() + 1).toString().padStart(2, '0');
        case 'dd':
          return base.getDate().toString().padStart(2, '0');
        case 'HH':
          return base.getHours().toString().padStart(2, '0');
        case 'mm':
          return base.getMinutes().toString().padStart(2, '0');
        case 'ss':
          return base.getSeconds().toString().padStart(2, '0');
        case 'SSS':
          return base.getMilliseconds().toString().padStart(3, '0');
        case 'AP':
          return base.getHours() < 12 ? 'AM' : 'PM';
        case 'YY':
          return base.getFullYear().toString().slice(-2);
        case 'M':
          return (base.getMonth() + 1).toString().padStart(2, '0');
        case 'd':
          return base.getDate().toString().padStart(2, '0');
        case 'H':
          return base.getHours().toString().padStart(2, '0');
        case 'm':
          return base.getMinutes().toString().padStart(2, '0');
        case 's':
          return base.getSeconds().toString().padStart(2, '0');
        case 'S':
          return base.getMilliseconds().toString().padStart(3, '0');
        default:
          return match;
      }
    });
  }

  static toOnlyDateUTC(date: string | Date = new Date()) {
    const base = new Date(date);
    return this.convert('YYYY-MM-ddTHH:mm:ss.SSSZ', base);
  }

  static toUTC(format: string = 'YYYY-MM-dd HH:mm:ss.SSS', date: string | Date = new Date()) {
    const base = new Date(date);
    return this.convert(format, base);
  }

  static toOnlyDateKST(date: string | Date = new Date()) {
    const base = new Date(date);
    base.setHours(base.getHours() + 9);
    return this.convert('YYYY-MM-ddTHH:mm:ss.SSSZ', base);
  }

  static toKST(format: string = 'YYYY-MM-dd HH:mm:ss.SSS', date: string | Date = new Date()) {
    const base = new Date(date);
    base.setHours(base.getHours() + 9);
    return this.convert(format, base);
  }
}
