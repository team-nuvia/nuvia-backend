import { CommonService } from '@common/common.service';
import { Injectable } from '@nestjs/common';
import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

type TemplateName = 'invitation' | 'notice' | 'changePassword' | 'resetPassword';

interface ChangePasswordData {
  title: string;
  userName: string;
  changePasswordUrl?: string;
}

interface ResetPasswordData {
  email: string;
  token: string;
}

interface NoticeData {
  title: string;
  content: string;
  actionUrl?: string;
  toUserName: string;
  organizationName: string;
}

interface InvitationData {
  inviteeEmail: string;
  inviterEmail: string;
  inviterName: string;
  organizationName: string;
  invitationUrl: string;
}

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

  async sendInvitationMail(to: string, data: InvitationData) {
    const content = await this.getTemplate('invitation', data);
    await this.sendMail(to, '[누비아 활동 알림] 구독 서비스 초대', content);
  }

  async sendNoticeMail(to: string, { actionUrl = undefined, ...data }: NoticeData) {
    const content = await this.getTemplate('notice', { ...data, actionUrl });
    await this.sendMail(to, `[누비아 활동 알림] ${data.title}`, content);
  }

  async sendChangePasswordMail(to: string, title: string, { userName, changePasswordUrl = undefined, ...data }: ChangePasswordData) {
    const content = await this.getTemplate('changePassword', { ...data, changePasswordUrl, userName });
    await this.sendMail(to, `[누비아 활동 알림] ${title}`, content);
  }

  async sendResetPasswordEmail(to: string) {
    const otpToken = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, '0');
    const data = {
      email: to,
      token: otpToken,
    } as ResetPasswordData;
    const content = await this.getTemplate('resetPassword', data);
    await this.sendMail(to, '[누비아 활동 알림] 비밀번호 재설정', content);
    return otpToken;
  }

  async sendMail(to: string, subject: string, content: string) {
    await this.transporter.sendMail({
      to,
      from: this.config.auth.user,
      subject,
      html: content,
    });
  }

  private async getTemplate(name: TemplateName, data: Record<string, any> = {}) {
    const content = await ejs.renderFile(path.join(path.resolve(), 'src', 'emails', 'templates', `${name}.template.ejs`), data);
    const layout = await ejs.renderFile(path.join(path.resolve(), 'src', 'emails', 'templates', 'layout.ejs'), { content });

    return layout;
  }
}
