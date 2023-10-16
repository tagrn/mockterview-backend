import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService, Repository<User>],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get<Repository<User>>(Repository<User>);
  });
});
