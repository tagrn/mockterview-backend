import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  @Get()
  getQuestionSummaries(): any {
    return [
      { id: 1, title: 'DS(Data Structures)' },
      { id: 2, title: 'OS(Operation System)' },
      { id: 3, title: 'Network' },
    ];
  }
}
