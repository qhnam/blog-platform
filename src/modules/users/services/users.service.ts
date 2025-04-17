import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { ErrorException } from 'src/common/exception/error.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UserEntity } from '../entities/users.entity';
import { USER_ERROR_ENUM } from '../enums/user-error.enum';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

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
    });

    await this.userRepo.save(newUser);
    const { password: _, ...safeUser } = newUser;

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

    const { password: _, ...safeUser } = user;
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
}
