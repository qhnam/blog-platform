import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  title: string;
}
