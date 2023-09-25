import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QuestionSet } from './entities/question-set.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionSummarySchema } from './schemas/question-summary.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionSet)
    private readonly questionSetRepository: Repository<QuestionSet>,
  ) {}

  async getQuestionSummariesByUserId(userId: number) {
    const questionSets = await this.questionSetRepository.findBy({ userId });
    return questionSets.map((qs) => new QuestionSummarySchema(qs.id, qs.title));
  }
}
