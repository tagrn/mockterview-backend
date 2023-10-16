import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from '../auth/auth.decorator';
import { JWTAuthGuard, UnsafeJWTAuthGuard } from '../auth/jwt-auth.guard';
import { UserSchema } from '../user/schemas/user.schema';
import { QuestionService } from './question.service';
import { QuestionSetRequest } from './requests/question-set.request';
import { QuestionSetResponse } from './responses/question-set.response';
import { QuestionSummaryResponse } from './responses/question-summary.response';
import { UnsavedQuestionSetSchema } from './schemas/question-set.schema';

@ApiTags('QUESTION')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('basic')
  async getBasicQuestionSummariesApi(): Promise<QuestionSummaryResponse[]> {
    const questionSummaries = await this.questionService.getBasicQuestionsApi();
    return questionSummaries.map(
      (qs) => new QuestionSummaryResponse(qs.id, qs.title),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get()
  async getQuestionSummariesApi(
    @AuthorizedUser() user: UserSchema,
  ): Promise<QuestionSummaryResponse[]> {
    const questionSummaries =
      await this.questionService.getQuestionSummariesByUserId(user.id);
    return questionSummaries.map(
      (qs) => new QuestionSummaryResponse(qs.id, qs.title),
    );
  }

  @UseGuards(UnsafeJWTAuthGuard)
  @ApiBearerAuth()
  @Get('/:id')
  async getQuestionSetApi(
    @AuthorizedUser() user: UserSchema,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QuestionSetResponse> {
    const questionSet = await this.questionService.getQuestionSetByIdAndUserId(
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
    return await this.questionService.createQuestionSet(
      user.id,
      new UnsavedQuestionSetSchema(title, questions, isPrivate),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  async deleteQuestionsApi(
    @AuthorizedUser() user: UserSchema,
    @Param('id', ParseIntPipe) questionSetId: number,
  ): Promise<number> {
    return await this.questionService.deleteQuestionSet(questionSetId);
  }
}
