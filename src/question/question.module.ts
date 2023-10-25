import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSet } from '../entities/question-set.entity';
import { QuestionSetController } from './question-set.controller';
import { QuestionSetService } from './question-set.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet])],
  controllers: [QuestionSetController],
  providers: [QuestionSetService],
})
export class QuestionModule {}
