import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({})
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({})
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  search?: string;

  constructor() {
    this.page = this.page ?? 1;
    this.limit = this.limit ?? 20;
    this.search = this.search ?? '';
  }

  public getOffset(): number {
    if (!this.page) this.page = 1;
    if (!this.limit) this.limit = 20;
    return (this.page - 1) * this.limit;
  }
}
