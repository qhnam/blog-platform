import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { SuccessResponse } from 'src/common/response/success.response';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';
import { UserService } from '../services/users.service';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { CustomRequest } from 'src/common/guards/guard.const';
import { UserGuard } from 'src/common/guards/user.guard';
import { ApiSuccessNoContentResponse } from 'src/common/response/api-success-no-content.response';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { ResendOtpDto } from '../dtos/resend-otp.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiSuccessResponse(RegisterResponse)
  async createUser(@Body() dto: CreateUserDto) {
    return SuccessResponse.call(
      await this.userService.createUser(dto),
      'Register user successfully',
    );
  }

  @Post('login')
  @ApiSuccessResponse(LoginResponse)
  async login(@Body() dto: LoginUserDto) {
    return SuccessResponse.call(
      await this.userService.login(dto),
      'Login successfully',
    );
  }

  @Post('change-password')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiSuccessResponse(ApiSuccessNoContentResponse)
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: CustomRequest,
  ) {
    await this.userService.changePassword(req.jwtPayload.id, dto);
    return SuccessResponse.call(null, 'Change password successfully');
  }

  @Post('verify/email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.userService.verifyEmail(dto);
    return SuccessResponse.call(null, 'Verify otp successfully');
  }

  @Post('verify/email/resend-otp')
  async resendOtpVerifyEmail(@Body() dto: ResendOtpDto) {
    await this.userService.sendOtp(dto);
    return SuccessResponse.call(null, 'Send otp successfully');
  }
}
