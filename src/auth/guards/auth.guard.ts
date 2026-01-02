import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { AuthService, JWTPayload } from 'src/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Auth } from './auth.decorator';

export interface RequestSession extends Request {
  session: JWTPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private oathService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /* Auth Guard */

    const request: RequestSession = context.switchToHttp().getRequest();
    const strict = this.reflector.get(Auth, context.getHandler());
    const sessionId = request.cookies?.sessionId;

    if (!strict) {
      return true;
    }

    if (!sessionId) throw new HttpException('Unauthorized', 401);
    const session = await this.oathService.verify(sessionId);
    if (!session) throw new HttpException('Unauthorized', 401);

    request.session = session;
    return true;
  }
}
