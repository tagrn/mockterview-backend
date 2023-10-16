import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSet } from '../entities/question-set.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
