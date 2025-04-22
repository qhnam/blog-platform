import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/users.service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
