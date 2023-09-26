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

  async validateUser(email: string): Promise<any> {
    // const user = await this.usersService.getUserByEmail(email);
    // if (user) {
    //   return user;
    // }
    return null;
  }

  async getJWT(user: UserSchema): Promise<JWTSchema> {
    const payload = {
      nickname: user.nickname,
      email: user.email,
      sub: user.id,
    };
    return new JWTSchema(
      this.configService.get('TOKEN_TYPE'),
      this.jwtService.sign(payload),
    );
  }
}