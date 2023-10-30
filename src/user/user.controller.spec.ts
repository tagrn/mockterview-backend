import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserRole } from 'src/user/enums/user-role.enum';
import { JWTSchema } from 'src/user/schemas/jwt.schema';
import { JWTResponse } from 'src/user/responses/jwt.response';

const dummyType = 'Bearer';
const dummyEmail = 'test@gmail.com';
const dummyToken = 'sdajfklasdjf.sdkfhjkjlasd.jsdbnakjne';

describe('UserController', () => {
  let controller: UserController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getJWT: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
            saveUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    jest
      .spyOn(authService, 'getJWT')
      .mockResolvedValue(new JWTSchema(dummyType, dummyToken));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('존재하는 유저 이메일이 들어갔을 때', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(
          new UserSchema(1, dummyEmail, UserRole.GENERAL, '초보 면접자'),
        );
      const res = await controller.loginApi(dummyEmail);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(dummyEmail);
      expect(authService.getJWT).toHaveBeenCalledTimes(1);
      expect(authService.getJWT).toHaveBeenCalledWith(
        new UserSchema(1, dummyEmail, UserRole.GENERAL, '초보 면접자'),
      );
      expect(res).toStrictEqual(new JWTResponse(dummyType, dummyToken));
    });

    it('존재하지 않는 유저 이메일이 들어갔을 때', async () => {
      const notExistedEmail = 'notExisted@gmail.com';
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);
      jest
        .spyOn(userService, 'saveUser')
        .mockResolvedValue(
          new UserSchema(1, notExistedEmail, UserRole.GENERAL, '초보 면접자'),
        );
      const res = await controller.loginApi(notExistedEmail);

      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(notExistedEmail);
      expect(userService.saveUser).toHaveBeenCalledTimes(1);
      expect(userService.saveUser).toHaveBeenCalledWith(notExistedEmail);
      expect(authService.getJWT).toHaveBeenCalledTimes(1);
      expect(authService.getJWT).toHaveBeenCalledWith(
        new UserSchema(1, notExistedEmail, UserRole.GENERAL, '초보 면접자'),
      );
      expect(res).toStrictEqual(new JWTResponse(dummyType, dummyToken));
    });
  });
});
