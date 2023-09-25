import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @ApiProperty({
    example: 'w1v8wdv8cxvCDf25assd...',
    required: true,
  })
  public accessToken: string;
}
