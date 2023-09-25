import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { QuestionSummaryResponse } from './responses/question-summary.response';
import { QuestionsService } from './questions.service';

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
    @Request() req,
  ): Promise<QuestionSummaryResponse[]> {
    const userId: number = req.user.userId;
    const questionSummaries =
      await this.questionsService.getQuestionSummariesByUserId(userId);
    return questionSummaries.map(
      (qs) => new QuestionSummaryResponse(qs.id, qs.title),
    );
  }
}
