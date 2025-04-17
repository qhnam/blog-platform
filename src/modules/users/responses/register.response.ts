import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'usertest@gmail.com',
  })
  email: string;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty({})
  updatedAt: Date;
}
