import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest } from './requests/login.request';
import { JWTResponse } from './responses/jwt.response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  @Post('login')
  loginApi(@Body() loginRequest: LoginRequest): JWTResponse {
    return new JWTResponse(loginRequest.tokenType, loginRequest.accessToken);
  }
}
