import { ApiProperty } from '@nestjs/swagger';

type UserLoginResponse = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export class LoginResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hbXFoMjExMTFAZ21haWwuY29tIiwic3ViIjoxMSwiaWF0IjoxNzQ0ODYxMTkzLCJleHAiOjE3NDQ5NDc1OTN9.LQpVXuywX01j6APNu3bKXlVXh7FuNYx2EfKcYbuaDTg',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hbXFoMjExMTFAZ21haWwuY29tIiwic3ViIjoxMSwiaWF0IjoxNzQ0ODYxMTkzLCJleHAiOjE3NDQ5NDc1OTN9.LQpVXuywX01j6APNu3bKXlVXh7FuNYx2EfKcYbuaDTg',
  })
  refreshToken: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'test@gmail.com',
      createdAt: '2025-04-17T07:03:32.000Z',
      updatedAt: '2025-04-17T07:03:32.000Z',
    },
  })
  user: UserLoginResponse;
}
