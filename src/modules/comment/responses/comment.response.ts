import { ApiProperty } from '@nestjs/swagger';

class UserResponse {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  email: string;
}

export class CommentResponse {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  content: string;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty({})
  user: UserResponse;
}
