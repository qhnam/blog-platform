import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { ErrorException } from 'src/common/exception/error.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/users.entity';
import { USER_ERROR_ENUM } from '../enums/user-error.enum';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT } from 'src/common/const/environment';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private generateAccessToken(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.signAsync(payload, {
      expiresIn: ENVIRONMENT.JWT_LIFE_TIME_ACCESS,
    });

    // const refreshToken =

    return accessToken;
  }

  async createUser(dto: CreateUserDto) {
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

    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepo.save(newUser);
    const { password: _, ...safeUser } = newUser;

    return safeUser;
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new ErrorException(
        USER_ERROR_ENUM.INVALID_CREDENTIALS,
        'Invalid credentials',
      );
    }
  }
}
