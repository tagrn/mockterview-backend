import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleUserSchema } from './schemas/google-user.schema';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { accessToken } = request.body;
    const googleUser: GoogleUserSchema = await this.authService.getGoogleUser(
      accessToken,
    );

    if (!googleUser.email) {
      throw new UnauthorizedException();
    }

    request.user = { email: googleUser.email };
    return true;
  }
}
