import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';

export const GoogleEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.email;
  },
);

export const AuthorizedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return request.user;
    }
    return { id: 0, email: '', role: UserRole.NONUSER, nickname: '비회원' };
  },
);
