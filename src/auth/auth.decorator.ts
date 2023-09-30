import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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
    return { id: 0, email: '', nickname: '비회원' };
  },
);
