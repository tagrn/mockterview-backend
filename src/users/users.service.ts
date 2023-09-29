import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSchema } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async saveUser(email: string) {
    const user = await this.usersRepository.save({ email });
    return new UserSchema(user.id, user.email, user.nickname);
  }

  async getUserByEmail(email: string): Promise<UserSchema | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      return null;
    }

    return new UserSchema(user.id, user.nickname, user.email);
  }
}
