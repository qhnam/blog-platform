import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({})
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
