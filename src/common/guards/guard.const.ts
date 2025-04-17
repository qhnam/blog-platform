import { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
}

export interface CustomRequest extends Request {
  jwtPayload: JwtPayload;
}
