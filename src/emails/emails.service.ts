import { CommonService } from '@common/common.service';
import { Injectable } from '@nestjs/common';
import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

type TemplateName = 'invitation';

@Injectable()
export class EmailsService {
  transporter: Transporter;

  constructor(private readonly commonService: CommonService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      service: this.config.service,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    });
  }

  get config() {
    return this.commonService.getConfig('email');
  }

  async sendInvitationMail(to: string, data: Record<string, any>) {
    console.log('send email service:', to, data);
    const content = await this.getTemplate('invitation', data);
    await this.sendMail(to, 'Invitation to join the subscription', content);
  }

  async sendMail(to: string, subject: string, content: string) {
    await this.transporter.sendMail({
      to,
      from: this.config.auth.user,
      subject,
      html: content,
    });
  }

  private getTemplate(name: TemplateName, data: Record<string, any> = {}) {
    return ejs.renderFile(path.join(path.resolve(), 'src', 'emails', 'templates', `${name}.template.ejs`), data);
  }
}
