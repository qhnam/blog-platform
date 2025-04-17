import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { SuccessResponse } from 'src/common/response/success.response';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';
import { UserService } from '../services/users.service';

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
}
