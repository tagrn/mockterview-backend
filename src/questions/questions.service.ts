import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { QuestionSet } from './entities/question-set.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionSummarySchema } from './schemas/question-summary.schema';
import {
  QuestionSetSchema,
  UnsavedQuestionSetSchema,
} from './schemas/question-set.schema';

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

  async getQuestionSetByIdAndUserId(
    questionsSetId: number,
    userId: number,
  ): Promise<QuestionSetSchema> {
    const questionSet: QuestionSet = await this.questionSetRepository
      .createQueryBuilder('questionSet')
      .where('questionSet.id = :questionsSetId', { questionsSetId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('questionSet.userId = :userId', { userId }).orWhere(
            'questionSet.isPrivate = :isPrivate',
            { isPrivate: false },
          );
        }),
      )
      .getOne();
    return new QuestionSetSchema(
      questionSet.id,
      questionSet.title,
      questionSet.questions.questions,
      questionSet.isPrivate,
    );
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
