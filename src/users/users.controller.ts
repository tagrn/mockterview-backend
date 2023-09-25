import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginRequest } from './requests/login.request';
import { JWTResponse } from './responses/jwt.response';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(
    // private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async loginApi(@Body() loginRequest: LoginRequest): Promise<JWTResponse> {
    // const googleUser = await this.authService.getGoogleUser(
    //   loginRequest.tokenType,
    //   loginRequest.accessToken,
    // );

    // let user = this.usersService.getUserByEmail(googleUser.email);
    // if (!user) {
    //   user = await this.usersService.saveUser(googleUser.email);
    // }
    return new JWTResponse(
      this.configService.get('tokenType'),
      '',
      // await this.authService.getJWT(user),
    );
  }
}
