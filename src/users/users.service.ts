import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async saveUser(email: string) {
    return this.usersRepository.save({ email });
  }

  async getUser(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
}
