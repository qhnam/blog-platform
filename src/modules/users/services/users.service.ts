import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { ErrorException } from 'src/common/exception/error.exception';
import { EMAIL_TYPE } from 'src/modules/common/mail/enums';
import { MailService } from 'src/modules/common/mail/services/mail.service';
import { OtpService } from 'src/modules/common/otp/services/otp.service';
import { OTP_TYPE } from 'src/modules/enums/otp-type.enum';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { UserEntity } from '../entities/users.entity';
import { USER_ERROR_ENUM } from '../enums/user-error.enum';
import { USER_STATUS } from '../enums/user-status.enum';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';
import { AuthService } from './auth.service';
import { ResendOtpDto } from '../dtos/resend-otp.dto';
import { JwtPayload } from 'src/common/guards/guard.const';
import { EmailProcessor } from '../processors/email.processor';
import { QueueService } from 'src/modules/common/queue/services/queue.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly queueService: QueueService,
  ) {}

  @Transactional()
  async createUser(dto: CreateUserDto): Promise<RegisterResponse> {
    if (dto.password !== dto.confirmPassword) {
      throw new ErrorException(
        USER_ERROR_ENUM.CONFIRM_PASSWORD_NOT_MATCH,
        'Confirm password not match',
      );
    }

    const existUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existUser) {
      throw new ErrorException(
        USER_ERROR_ENUM.EMAIL_ALREADY_EXISTS,
        'Email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      fullname: dto.fullname,
      status: USER_STATUS.UNVERIFIED,
    });

    await this.userRepo.save(newUser);
    const { password: _, status: __, ...safeUser } = newUser;

    const otp = await this.otpService.generateOtp(
      newUser.email,
      OTP_TYPE.EMAIL_VERIFY,
    );

    await this.queueService.addSendEmailJob({
      to: newUser.email,
      type: EMAIL_TYPE.EMAIL_VERIFY,
      data: {
        fullname: newUser.fullname,
        otp: otp,
      },
    });

    return safeUser;
  }

  async login(dto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new ErrorException(
        USER_ERROR_ENUM.INVALID_CREDENTIALS,
        'Invalid credentials',
      );
    }

    if (user.status === USER_STATUS.UNVERIFIED) {
      throw new ErrorException(
        USER_ERROR_ENUM.UNVERIFIED,
        'Your account is not verified',
      );
    }

    if (user.status === USER_STATUS.BLOCK) {
      throw new ErrorException(
        USER_ERROR_ENUM.BLOCKED,
        'Your account is blocked',
      );
    }

    const { password: _, status: __, ...safeUser } = user;
    const { accessToken, refreshToken } =
      this.authService.generateAccessToken(user);
    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new ErrorException(USER_ERROR_ENUM.NOT_FOUND, 'User not found');
    }

    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new ErrorException(
        USER_ERROR_ENUM.INVALID_CREDENTIALS,
        'Current password is incorrect',
      );
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new ErrorException(
        USER_ERROR_ENUM.INVALID_CREDENTIALS,
        'New password and confirm password do not match',
      );
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    await this.otpService.verifyOtp(dto.email, dto.opt, OTP_TYPE.EMAIL_VERIFY);

    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new ErrorException(USER_ERROR_ENUM.NOT_FOUND, 'User not found');
    }

    user.status = USER_STATUS.VERIFIED;
    await this.userRepo.save(user);
  }

  async sendOtp({ email }: ResendOtpDto) {
    const user = await this.userRepo.findOne({ where: { email: email } });

    // In case the user spams the mail,
    // it will still notify that the OTP was successfully sent to the email to avoid users from searching for information on the system.
    if (!user) {
      return;
    }
    const otp = await this.otpService.generateOtp(
      email,
      OTP_TYPE.EMAIL_VERIFY,
      true,
    );

    await this.mailService.sendMail({
      to: email,
      type: EMAIL_TYPE.EMAIL_VERIFY,
      data: {
        fullname: user.fullname,
        otp: otp,
      },
    });
  }

  async refreshToken(refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
