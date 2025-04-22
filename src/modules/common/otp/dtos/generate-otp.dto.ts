import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateOtpDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
