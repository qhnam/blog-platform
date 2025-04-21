import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { ApiTags } from '@nestjs/swagger';
import { GenerateOtpDto } from '../dtos/generate-otp.dto';
import { SuccessResponse } from 'src/common/response/success.response';
import { OTP_TYPE } from 'src/modules/enums/otp-type.enum';

@Controller('otp')
@ApiTags('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('email/verify')
  async sendEmailVerificationOtp(@Body() dto: GenerateOtpDto) {
    return SuccessResponse.call(
      await this.otpService.generateOtp(dto.identifier, OTP_TYPE.EMAIL_VERIFY),
      '',
    );
  }
}
