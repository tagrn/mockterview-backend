import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async saveUser(email: string) {
    return this.usersRepository.save({ email });
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
}
