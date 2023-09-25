export class UserSchema {
  constructor(email: string, nickname: string, id: number = undefined) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }
  id?: number;
  email: string;
  nickname: string;
}
