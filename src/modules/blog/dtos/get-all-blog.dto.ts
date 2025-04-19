import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/base-filter.dto';
import { SORT } from 'src/common/enum/pagination.enum';
import { FILTER_BLOG } from '../enums/filter.enum';

export class GetAllBlogDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    required: false,
    default: FILTER_BLOG.CREATED_AT,
    enum: FILTER_BLOG,
  })
  @IsOptional()
  @IsString()
  @IsIn([FILTER_BLOG.TITLE, FILTER_BLOG.CREATED_AT])
  override orderBy?: string = FILTER_BLOG.CREATED_AT;

  @ApiProperty({
    required: false,
    enum: SORT,
    default: SORT.DESC,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SORT)
  override sort?: SORT = SORT.DESC;
}
