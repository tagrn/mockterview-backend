import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from '../auth/auth.decorator';
import { JWTAuthGuard, UnsafeJWTAuthGuard } from '../auth/jwt-auth.guard';
import { UserSchema } from '../user/schemas/user.schema';
import { QuestionSetService } from './question-set.service';
import { QuestionSetRequest } from './requests/question-set.request';
import { QuestionSetResponse } from './responses/question-set.response';
import { QuestionSummaryResponse } from './responses/question-summary.response';
import {
  QuestionSetSchema,
  UnsavedQuestionSetSchema,
} from './schemas/question-set.schema';

@ApiTags('QUESTION')
@Controller('question-sets')
export class QuestionSetController {
  constructor(private readonly questionService: QuestionSetService) {}

  @Get('basic')
  async getBasicQuestionSummariesApi(): Promise<QuestionSummaryResponse[]> {
    const questionSummaries = await this.questionService.getBasicQuestions();
    return questionSummaries.map(
      (qs) =>
        new QuestionSummaryResponse(
          qs.id,
          qs.title,
          qs.questionCount,
          qs.viewCount,
          qs.updatedAt,
        ),
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
      (qs) =>
        new QuestionSummaryResponse(
          qs.id,
          qs.title,
          qs.questionCount,
          qs.viewCount,
          qs.updatedAt,
        ),
    );
  }

  @UseGuards(UnsafeJWTAuthGuard)
  @ApiBearerAuth()
  @Get('/:id')
  async getQuestionSetApi(
    @AuthorizedUser() user: UserSchema,
    @Param('id', ParseIntPipe) id: number,
    @Query('view', new DefaultValuePipe(false), ParseBoolPipe)
    isViewing: boolean,
  ): Promise<QuestionSetResponse> {
    if (user.id === 0) {
      user.id = 2;
    }
    const questionSet = await this.questionService.getQuestionSetByIdAndUserId(
      user.id,
      id,
    );
    if (isViewing) {
      await this.questionService.increaseViewCount(user.id, id);
    }
    return new QuestionSetResponse(
      questionSet.id,
      questionSet.title,
      questionSet.questions,
      questionSet.isPrivate,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Patch('/:id')
  async patchuestionsApi(
    @AuthorizedUser() user: UserSchema,
    @Param('id', ParseIntPipe) id: number,
    @Body() questionSetRequest: QuestionSetRequest,
  ): Promise<number> {
    const { title, questions, isPrivate } = { ...questionSetRequest };
    return await this.questionService.updateQuestionSet(
      user.id,
      new QuestionSetSchema(id, title, questions, isPrivate),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @HttpCode(201)
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
