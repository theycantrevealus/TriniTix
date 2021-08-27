import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    super();
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      new UnauthorizedException();
      return false;
    }

    try {
      const token = request.headers.authorization;
      const cleanToken = token.split('Bearer')[1].trim();
      const decoded = await this.jwtService.decode(cleanToken, {
        complete: true,
      });
      const decodedData = (decoded as any).payload;
      if (decoded) {
        const userDetail = await this.userService.detail(decodedData.uid);
        request.user = userDetail;
        if (userDetail) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
