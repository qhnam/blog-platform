import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SORT } from '../enum/pagination.enum';

export class BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    enum: SORT,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SORT)
  sort?: SORT;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  constructor() {
    this.page = this.page ?? 1;
    this.limit = this.limit ?? 20;
    this.search = this.search ?? '';
    this.sort = this.sort ?? SORT.DESC;
  }

  public getOffset(): number {
    if (!this.page) this.page = 1;
    if (!this.limit) this.limit = 20;
    return (this.page - 1) * this.limit;
  }
}
