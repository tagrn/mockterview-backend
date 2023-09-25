import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginAuthGuard } from 'src/auth/login-auth.guard';
import { LoginRequest } from './requests/login.request';
import { JWTResponse } from './responses/jwt.response';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBody({ type: LoginRequest })
  @UseGuards(LoginAuthGuard)
  @Post('login')
  async loginApi(@Body() email: string): Promise<JWTResponse> {
    let user = await this.usersService.getUserByEmail(email);
    if (!user) user = await this.usersService.saveUser(email);

    const jwtSchema = await this.authService.getJWT(user);
    return new JWTResponse(jwtSchema.tokenType, jwtSchema.accessToken);
  }
}
