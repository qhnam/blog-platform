import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseFilterDto } from 'src/common/dtos/base-filter.dto';

export class GetAllCommentDto extends BaseFilterDto {
  @ApiProperty({})
  @IsNumber()
  @Type(() => Number)
  blogId: number;

  declare search?: never;
  declare sort?: never;
  declare orderBy?: never;
}
