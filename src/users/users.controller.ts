import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginAuthGuard } from 'src/auth/login-auth.guard';
import { LoginRequest } from './requests/login.request';
import { JWTResponse } from './responses/jwt.response';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

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
    if (!user) {
      user = await this.usersService.saveUser(email);
    }
    return await this.authService.getJWT(user);
  }
}
