import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [QuestionsModule],
  controllers: [AppController, QuestionsController],
  providers: [],
})
export class AppModule {}
