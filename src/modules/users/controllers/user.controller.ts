import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SuccessResponse } from 'src/common/response/success.response';

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
}
