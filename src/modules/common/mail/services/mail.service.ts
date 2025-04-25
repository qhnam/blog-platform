import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ISendMailInput, TEmailVerify } from '../types';
import { EMAIL_TYPE } from '../enums';
import { MailTemplate } from '../templates/mail.template';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(data: ISendMailInput) {
    await this.mailerService.sendMail({
      to: data.to,
      ...this._getTemplate(data),
    });
  }

  private _getTemplate(data: ISendMailInput) {
    switch (data.type) {
      case EMAIL_TYPE.EMAIL_VERIFY: {
        const dataEmail = data.data as TEmailVerify;
        return {
          subject: 'Verify email',
          // context: {
          //   username: dataEmail.fullname,
          //   otp: dataEmail.otp,
          // },
          html: MailTemplate.verifyMail(dataEmail),
        };
      }
      case EMAIL_TYPE.FORGOT_PASSWORD: {
        const dataEmail = data.data as TEmailVerify;
        return {
          subject: 'Forgot password',
          html: MailTemplate.forgotPassword(dataEmail),
        };
      }
    }
  }
}
