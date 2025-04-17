import { CustomRequest } from './guard.const';

export class GuardUtil {
  public static extractTokenFromHeader(
    request: CustomRequest,
  ): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
