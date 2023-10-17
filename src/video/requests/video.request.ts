import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VideoRequest {
  @IsNumber()
  @ApiProperty({
    example: '1',
    required: true,
  })
  public questionSetId: number;

  @IsString()
  @ApiProperty({
    example: '자기소개 해주세요.',
    required: true,
  })
  public question: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'fd248f3f5s54t4...',
    required: true,
  })
  public video: BinaryData;
}
