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

  async getBasicQuestions(): Promise<QuestionSummarySchema[]> {
    const questionSet1 = await this.questionSetRepository.findOneBy({ id: 1 });
    const questionSet2 = await this.questionSetRepository.findOneBy({ id: 2 });
    return [
      new QuestionSummarySchema(
        questionSet1.id,
        questionSet1.title,
        questionSet1.questions.questions.length,
        await this.getQuestionSetViewCount(questionSet1.id),
        questionSet1.updatedAt,
      ),
      new QuestionSummarySchema(
        questionSet2.id,
        questionSet2.title,
        questionSet2.questions.questions.length,
        await this.getQuestionSetViewCount(questionSet2.id),
        questionSet2.updatedAt,
      ),
    ];
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

  async getQuestionSetViewCount(questionSetId: number) {
    const result = await this.questionSetRepository
      .createQueryBuilder('questionSet')
      .where('questionSet.id = :questionSetId', { questionSetId })
      .leftJoinAndSelect(
        'questionSet.questionSetViewCounts',
        'questionSetViewCounts',
      )
      .select('sum(questionSetViewCounts.count)', 'totalViewCount')
      .getRawOne();

    return Number(result.totalViewCount);
  }

  async getQuestionSummariesByUserId(
    userId: number,
  ): Promise<QuestionSummarySchema[]> {
    const questionSets = await this.questionSetRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
    return await Promise.all(
      questionSets.map(
        async (qs) =>
          new QuestionSummarySchema(
            qs.id,
            qs.title,
            qs.questions.questions.length,
            await this.getQuestionSetViewCount(qs.id),
            qs.updatedAt,
          ),
      ),
    );
  }
}
