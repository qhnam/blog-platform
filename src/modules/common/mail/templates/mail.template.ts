import { TEmailVerify } from '../types';

export class MailTemplate {
  static verifyMail(data: TEmailVerify) {
    return `
      <h1>Chào mừng <span style="color: #4e46b4">${data.fullname}</span>!</h1>
      <p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi.</p>
      <p>Mã xác nhận otp của bạn là ${data.otp}</p>
    `;
  }

  static forgotPassword(data: TEmailVerify) {
    return `
      <h1>Xin chào <span style="color: #4e46b4">${data.fullname}</span>!</h1>
      <p>Có vẽ như bạn đã quên mật khẩu của mình.</p>
      <p>Otp để khôi phục lại mật khẩu của bạn là: ${data.otp}</p>
    `;
  }
}
