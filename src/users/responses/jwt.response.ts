import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JWTResponse {
  @IsString()
  @ApiProperty({
    example: 'Bearer',
    required: true,
  })
  public tokenType: string;

  @IsString()
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
