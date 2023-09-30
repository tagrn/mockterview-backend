export class UserSchema {
  id: number;
  email: string;
  nickname: string;

  constructor(id: number, email: string, nickname: string) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }
}
