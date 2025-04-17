import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT } from '../const/environment';
import { CustomRequest, JwtPayload } from './guard.const';
import { GuardUtil } from './guard.util';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: CustomRequest = context.switchToHttp().getRequest();
      const token = GuardUtil.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = await this.jwtService.verify(token, {
        secret: ENVIRONMENT.JWT_ACCESS_SECRET,
      });

      request.jwtPayload = payload;

      return true;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
