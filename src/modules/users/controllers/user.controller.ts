import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SuccessResponse } from 'src/common/response/success.response';
import { LoginUserDto } from '../dtos/login-user.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() dto: CreateUserDto) {
    return SuccessResponse.call(
      await this.userService.createUser(dto),
      'Register user successfully',
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginUserDto) {
    return SuccessResponse.call(
      await this.userService.login(dto),
      'Login successfully',
    );
  }
}
