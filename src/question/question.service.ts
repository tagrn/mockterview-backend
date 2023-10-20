import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { QuestionSet } from '../entities/question-set.entity';
import {
  QuestionSetSchema,
  UnsavedQuestionSetSchema,
} from './schemas/question-set.schema';
import { QuestionSummarySchema } from './schemas/question-summary.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionSet)
    private readonly questionSetRepository: Repository<QuestionSet>,
  ) {}

  async getBasicQuestions(): Promise<QuestionSummarySchema[]> {
    const questionSet1 = await this.questionSetRepository.findOneBy({ id: 1 });
    const questionSet2 = await this.questionSetRepository.findOneBy({ id: 2 });
    return [
      new QuestionSummarySchema(
        questionSet1.id,
        questionSet1.title,
        questionSet1.questions.questions.length,
        questionSet1.updatedAt,
      ),
      new QuestionSummarySchema(
        questionSet2.id,
        questionSet2.title,
        questionSet2.questions.questions.length,
        questionSet2.updatedAt,
      ),
    ];
  }

  async getQuestionSummariesByUserId(
    userId: number,
  ): Promise<QuestionSummarySchema[]> {
    const questionSets = await this.questionSetRepository.findBy({ userId });
    return questionSets.map(
      (qs) =>
        new QuestionSummarySchema(
          qs.id,
          qs.title,
          qs.questions.questions.length,
          qs.updatedAt,
        ),
    );
  }

  async getQuestionSetByIdAndUserId(
    questionsSetId: number,
    userId: number,
  ): Promise<QuestionSetSchema> {
    const questionSet: QuestionSet = await this.questionSetRepository.findOneBy(
      {
        id: questionsSetId,
      },
    );

    if (!questionSet) {
      throw new NotFoundException();
    }

    if (questionSet.userId !== userId && questionSet.isPrivate === true) {
      throw new ForbiddenException();
    }

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

  async deleteQuestionSet(questionSetId: number): Promise<number> {
    const deleteResult: DeleteResult = await this.questionSetRepository.delete({
      id: questionSetId,
    });

    if (!deleteResult.affected) {
      throw new BadRequestException();
    }

    return questionSetId;
  }
}
