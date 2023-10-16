export class JWTResponse {
  public tokenType: string;
  public accessToken: string;

  constructor(tokenType: string, accessToken: string) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
  }
}
