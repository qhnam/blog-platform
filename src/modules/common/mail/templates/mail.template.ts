import { TEmailVerify } from '../types';

export class MailTemplate {
  static verifyMail(data: TEmailVerify) {
    return `
      <h1>Chào mừng ${data.fullname}!</h1>
      <p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi.</p>
      <p>Mã xác nhận otp của bạn là ${data.otp}</p>
    `;
  }
}
