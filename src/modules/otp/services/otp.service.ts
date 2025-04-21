import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from 'src/common/utils';
import { OTP_TTL_CONST } from '../constant';
import { OTP_TYPE } from 'src/modules/enums/otp-type.enum';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private _generateKey(identifier: string, otpType: OTP_TYPE) {
    return `otp:${otpType}:${identifier}`;
  }

  async generateOtp(identifier: string, otpType: OTP_TYPE) {
    const otp = Utils.generateRandomNumber(6);

    await this.cacheManager.set(
      this._generateKey(identifier, otpType),
      otp,
      OTP_TTL_CONST,
    );

    return otp;
  }

  async verifyOtp(identifier: string, otp: string, otpType: OTP_TYPE) {
    const storeOtp = await this.cacheManager.get(
      this._generateKey(identifier, otpType),
    );

    if (!storeOtp || storeOtp !== otp) {
      return false;
    }

    await this.cacheManager.del(this._generateKey(identifier, otpType));
    return true;
  }
}
