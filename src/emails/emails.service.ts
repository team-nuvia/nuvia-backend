import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsService {
  
  
  sendMail(to: string, subject: string, text: string) {
    return this.mailService.sendMail({
      to,
      subject,
      text,
    });
  }
}
