import { ApiProperty } from '@nestjs/swagger';

class UserResponse {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  email: string;
}

class CategoryResponse {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  title: string;

  @ApiProperty({})
  slug: string;
}

export class BlogResponse {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  title: string;

  @ApiProperty({})
  slug: string;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty({})
  updatedAt: Date;

  @ApiProperty({})
  user: UserResponse;

  @ApiProperty({})
  category: CategoryResponse;
}
