import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/auth/auth.decorator';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserSchema } from 'src/users/schemas/user.schema';
import { QuestionsService } from './questions.service';
import { QuestionSummaryResponse } from './responses/question-summary.response';

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
}
