import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Utils } from 'src/common/utils';
import { OTP_TTL_CONST, OTP_TTL_COOL_DOWN_CONST } from '../constant';
import { OTP_TYPE } from 'src/modules/enums/otp-type.enum';
import { ErrorException } from 'src/common/exception/error.exception';
import { OTP_ERROR_CODE } from '../enums/otp-error';

@Injectable()
export class OtpService {
  constructor(@Inject('CACHE_REDIS') private readonly cacheManager: Cache) {}

  private _generateKey(identifier: string, otpType: OTP_TYPE) {
    return `otp:${otpType}:${identifier}`;
  }

  private _generateRetryKey(identifier: string, otpType: OTP_TYPE) {
    return `otp-retry:${otpType}:${identifier}`;
  }

  private _generateCoolDownKey(identifier: string, otpType: OTP_TYPE) {
    return `otp-cool-down:${otpType}:${identifier}`;
  }

  async generateOtp(
    identifier: string,
    otpType: OTP_TYPE,
    isResend = false,
  ): Promise<string | null> {
    if (!isResend) {
      const existingCoolDown = await this.cacheManager.get(
        this._generateCoolDownKey(identifier, otpType),
      );

      if (existingCoolDown) {
        throw new ErrorException(
          OTP_ERROR_CODE.REQUEST_OTP_TOO_QUICKLY,
          'You are requesting OTP too quickly. Please try again later.',
        );
      }
    } else {
      await this.cacheManager.del(
        this._generateCoolDownKey(identifier, otpType),
      );
    }

    const otp = Utils.generateRandomNumber(6);

    await Promise.all([
      this.cacheManager.set(
        this._generateKey(identifier, otpType),
        otp,
        OTP_TTL_CONST,
      ),
      this.cacheManager.set(
        this._generateCoolDownKey(identifier, otpType),
        '1',
        OTP_TTL_COOL_DOWN_CONST,
      ),
    ]);

    return otp;
  }

  async verifyOtp(
    identifier: string,
    otp: string,
    otpType: OTP_TYPE,
  ): Promise<boolean> {
    const [storeOtp, storeOtpRetryCountRaw] = await Promise.all([
      this.cacheManager.get(this._generateKey(identifier, otpType)),
      this.cacheManager.get(this._generateRetryKey(identifier, otpType)),
    ]);

    const storeOtpRetryCount = parseInt(
      (storeOtpRetryCountRaw as string) || '0',
      10,
    );

    if (storeOtpRetryCount >= 5) {
      throw new ErrorException(
        OTP_ERROR_CODE.OTP_MAX_RETRY,
        'You have entered the wrong OTP too many times. Please request a new OTP.',
      );
    }

    if (!storeOtp || storeOtp !== otp) {
      await this.cacheManager.set(
        this._generateRetryKey(identifier, otpType),
        storeOtpRetryCount + 1,
        OTP_TTL_CONST,
      );

      throw new ErrorException(OTP_ERROR_CODE.OTP_INVALID, 'Otp invalid');
    }

    await this.cacheManager.del(this._generateKey(identifier, otpType));
    await this.cacheManager.del(this._generateRetryKey(identifier, otpType));

    return true;
  }
}
