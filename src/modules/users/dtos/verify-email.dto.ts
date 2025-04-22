import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({})
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  opt: string;
}
