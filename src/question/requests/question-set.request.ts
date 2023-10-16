import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsBoolean, IsString } from 'class-validator';

export class QuestionSetRequest {
  @IsString()
  @ApiProperty({
    example: '모의 질문 Set',
    required: true,
  })
  public title: string;

  @ArrayNotEmpty()
  @ApiProperty({
    example: ['질문 1', '질문 2'],
    required: true,
  })
  public questions: string[];

  @IsBoolean()
  @ApiProperty({
    example: false,
    required: true,
  })
  public isPrivate: boolean;
}
