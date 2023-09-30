import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/auth/auth.decorator';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserSchema } from 'src/users/schemas/user.schema';
import { QuestionsService } from './questions.service';
import { QuestionSetRequest } from './requests/question-set.request';
import { QuestionSummaryResponse } from './responses/question-summary.response';
import { UnsavedQuestionSetSchema } from './schemas/question-set.schema';
import { QuestionSetResponse } from './responses/question-set.response';

@ApiTags('QUESTION')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('basic')
  async getBasicQuestionSummariesApi(): Promise<QuestionSummaryResponse[]> {
    return [
      new QuestionSummaryResponse(1, '모의 면접 1'),
      new QuestionSummaryResponse(2, '모의 면접 2'),
    ];
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get()
  async getQuestionSummariesApi(
    @AuthorizedUser() user: UserSchema,
  ): Promise<QuestionSummaryResponse[]> {
    const questionSummaries =
      await this.questionsService.getQuestionSummariesByUserId(user.id);
    return questionSummaries.map(
      (qs) => new QuestionSummaryResponse(qs.id, qs.title),
    );
  }

  // @TODO 인터셉터 필요
  @ApiBearerAuth()
  @Get('/:id')
  async getQuestionSetApi(
    @AuthorizedUser() user: UserSchema,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QuestionSetResponse> {
    const questionSet = await this.questionsService.getQuestionSetByIdAndUserId(
      id,
      user.id,
    );
    return new QuestionSetResponse(
      questionSet.id,
      questionSet.title,
      questionSet.questions,
      questionSet.isPrivate,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Post()
  async postQuestionsApi(
    @AuthorizedUser() user: UserSchema,
    @Body() questionSetRequest: QuestionSetRequest,
  ): Promise<number> {
    const { title, questions, isPrivate } = { ...questionSetRequest };
    return await this.questionsService.createQuestionSet(
      user.id,
      new UnsavedQuestionSetSchema(title, questions, isPrivate),
    );
  }
}
