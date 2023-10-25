import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionSetViewCount } from 'src/entities/question-set-view-count';
import { QuestionSet } from '../entities/question-set.entity';
import { QuestionSetController } from './question-set.controller';
import { QuestionSetService } from './question-set.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSet, QuestionSetViewCount])],
  controllers: [QuestionSetController],
  providers: [QuestionSetService],
})
export class QuestionModule {}
