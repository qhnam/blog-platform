import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({})
  @IsNumber()
  categoryId: number;

  @ApiProperty({})
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({})
  @IsString()
  text: string;
}
