import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTSchema } from 'src/users/schemas/jwt.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getGoogleUser(accessToken: string) {
    return await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    )
      .then((res) => {
        return res.json();
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  async getJWT(user: UserSchema): Promise<JWTSchema> {
    return new JWTSchema(
      this.configService.get('TOKEN_TYPE'),
      this.jwtService.sign({ ...user }),
    );
  }
}
