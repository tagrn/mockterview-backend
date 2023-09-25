import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSet } from './entities/question-set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
