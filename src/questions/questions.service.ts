import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QuestionSet } from './entities/question-set.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionSummarySchema } from './schemas/question-summary.schema';
import { UnsavedQuestionSetSchema } from './schemas/question-set.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionSet)
    private readonly questionSetRepository: Repository<QuestionSet>,
  ) {}

  async getQuestionSummariesByUserId(
    userId: number,
  ): Promise<QuestionSummarySchema[]> {
    const questionSets = await this.questionSetRepository.findBy({ userId });
    return questionSets.map((qs) => new QuestionSummarySchema(qs.id, qs.title));
  }

  async createQuestionSet(
    userId: number,
    newQuestionSet: UnsavedQuestionSetSchema,
  ): Promise<number> {
    const questionSet = await this.questionSetRepository.save({
      userId,
      title: newQuestionSet.title,
      questions: { questions: newQuestionSet.questions },
      isPrivate: newQuestionSet.isPrivate,
    });
    return questionSet.id;
  }
}
