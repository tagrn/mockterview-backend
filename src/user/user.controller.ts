import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GoogleEmail } from '../auth/auth.decorator';
import { AuthService } from '../auth/auth.service';
import { LoginAuthGuard } from '../auth/login-auth.guard';
import { LoginRequest } from './requests/login.request';
import { JWTResponse } from './responses/jwt.response';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @ApiBody({ type: LoginRequest })
  @UseGuards(LoginAuthGuard)
  @Post('login')
  async loginApi(@GoogleEmail() email: string): Promise<JWTResponse> {
    let user = await this.usersService.getUserByEmail(email);
    if (!user) user = await this.usersService.saveUser(email);

    const jwtSchema = await this.authService.getJWT(user);
    return new JWTResponse(jwtSchema.tokenType, jwtSchema.accessToken);
  }
}
