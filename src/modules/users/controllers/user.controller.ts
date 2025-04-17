import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { SuccessResponse } from 'src/common/response/success.response';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';
import { UserService } from '../services/users.service';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { CustomRequest } from 'src/common/guards/guard.const';
import { UserGuard } from 'src/common/guards/user.guard';

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

  @Post('change-password')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: CustomRequest,
  ) {
    console.log('req.jwtPayload', req.jwtPayload);
    await this.userService.changePassword(req.jwtPayload.id, dto);
    return SuccessResponse.call(null, 'Change password successfully');
  }
}
