import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const userId = 1;
const mockEmail = 'abc@mockmail.com';
const mockNickname = '초보 면접자';
const mockUser: User = {
  id: userId,
  email: mockEmail,
  nickname: mockNickname,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  QuestionSets: [],
  questionSetViewCounts: [],
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository<User>, // Mock 또는 실제 Repository 사용 가능
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('saveUser', () => {
    it('정상적인 이메일이 들어갔을 경우', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await userService.saveUser(mockEmail);

      expect(result.id).toBe(1);
      expect(result.email).toBe(mockEmail);
      expect(result.nickname).toBe(mockNickname);
    });
  });

  describe('getUserByEmail', () => {
    it('존재하는 이메일이 들어갔을 경우', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockEmail);

      expect(result.id).toBe(1);
      expect(result.email).toBe(mockEmail);
      expect(result.nickname).toBe(mockNickname);
    });

    it('존재하지 않는 이메일이 들어갔을 경우', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await userService.getUserByEmail(mockEmail);

      expect(result).toBe(null);
    });
  });
});
