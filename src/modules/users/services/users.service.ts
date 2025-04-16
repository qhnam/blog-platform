import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { ErrorException } from 'src/common/exception/error.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/users.entity';
import { USER_ERROR_ENUM } from '../enums/user-error.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  private hashPassword(password: string, salt: string): string {
    return bcrypt.hashSync(password, salt);
  }

  private genSalt() {
    return bcrypt.genSaltSync(12);
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

    const salt: string = this.genSalt();
    const hashedPassword = this.hashPassword(dto.password, salt);

    const newUser = this.userRepo.create({
      ...dto,
      salt,
      password: hashedPassword,
    });

    await this.userRepo.save(newUser);
    const { password: _, salt: __, ...safeUser } = newUser;

    return safeUser;
  }
}
