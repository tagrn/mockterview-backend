export class UserSchema {
  constructor(id: number, email: string, nickname: string) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }
  id: number;
  email: string;
  nickname: string;
}
