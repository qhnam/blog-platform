import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
