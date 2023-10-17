import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VideoRequest {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  public video: any;
}
