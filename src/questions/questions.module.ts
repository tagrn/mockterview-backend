import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSet } from '../entities/question-set.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
