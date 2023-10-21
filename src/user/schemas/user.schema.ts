import { UserRole } from '../enums/user-role.enum';

export class UserSchema {
  id: number;
  email: string;
  role: UserRole;
  nickname: string;

  constructor(id: number, email: string, role: UserRole, nickname: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.nickname = nickname;
  }
}
