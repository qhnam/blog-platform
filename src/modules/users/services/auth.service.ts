import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/users.entity';
import { ENVIRONMENT } from 'src/common/const/environment';
import { JwtPayload } from 'src/common/guards/guard.const';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  public generateAccessToken(user: UserEntity) {
    const payload = { email: user.email, id: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ENVIRONMENT.JWT_LIFE_TIME_ACCESS,
      secret: ENVIRONMENT.JWT_ACCESS_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: ENVIRONMENT.JWT_LIFE_TIME_REFRESH,
      secret: ENVIRONMENT.JWT_REFRESH_SECRET,
    });

    return { accessToken, refreshToken };
  }

  public async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verify(token, {
      secret: ENVIRONMENT.JWT_REFRESH_SECRET,
    });
  }

  public async refreshToken(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    if (!payload) return null;

    const accessToken = this.generateAccessToken({
      id: payload.id,
      email: payload.email,
    } as UserEntity);

    return accessToken;
  }
}
