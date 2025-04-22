import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ISendMailInput } from '../types';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(data: ISendMailInput) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Chào mừng bạn!',
      template: 'verify-email', // 👈 Đây là tên file template không có đuôi .hbs
      context: {},
    });

    console.log('call oki');
  }
}
