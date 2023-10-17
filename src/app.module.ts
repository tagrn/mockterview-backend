import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { News } from './entities/news';
import { QuestionSetViewCount } from './entities/question-set-view-count';
import { QuestionSet } from './entities/question-set.entity';
import { User } from './entities/user.entity';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    AuthModule,
    QuestionModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DATABASE'),
        entities: [User, QuestionSet, QuestionSetViewCount, News],
        synchronize: false,
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    VideoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
