import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { Video } from 'src/entities/video';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [AwsModule, TypeOrmModule.forFeature([Video]), ConfigModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
