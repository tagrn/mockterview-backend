import { PutObjectCommand } from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { Video } from 'src/entities/video';
import { Repository } from 'typeorm';
import { UnsavedVideoSchema, VideoSchema } from './schemas/video.schema';

@Injectable()
export class VideoService {
  constructor(
    private readonly awsService: AwsService,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async getVideo(id: number, userId: number): Promise<VideoSchema> {
    const video = await this.videoRepository.findOneBy({ id, userId });
    return new VideoSchema(
      video.id,
      video.userId,
      video.questionSetTitle,
      video.question,
      video.fileName,
    );
  }

  async saveVideo(videoSchema: UnsavedVideoSchema) {
    const video = await this.videoRepository.save({
      ...videoSchema,
    });
    return video.id;
  }

  async uploadVideoToS3(
    fileName: string,
    video: Express.Multer.File,
  ): Promise<void> {
    const params = await this.awsService.getS3PutParams(fileName, video.buffer);
    const s3Client = await this.awsService.getConfiguredS3Client();
    try {
      await s3Client.send(new PutObjectCommand(params));
    } catch (err) {
      Logger.error(`${fileName} S3 Upload Error`, err);
      throw new InternalServerErrorException();
    } finally {
      s3Client.destroy();
    }
  }
}
