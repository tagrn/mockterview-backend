import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuestionsModule } from './questions/questions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [QuestionsModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
