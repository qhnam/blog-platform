import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthService],
})
export class UserModule {}
