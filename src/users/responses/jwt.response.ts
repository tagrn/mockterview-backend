import { ApiProperty } from '@nestjs/swagger';

export class JWTResponse {
  @ApiProperty({
    example: 'Bearer',
    required: true,
  })
  public tokenType: string;

  @ApiProperty({
    example: 'w1v8wdv8cxvCDf25assd...',
    required: true,
  })
  public accessToken: string;

  constructor(tokenType: string, accessToken: string) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
  }
}
