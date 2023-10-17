import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { configuredS3, getS3Params } from 'src/aws/s3.config';
import { VideoSchema } from './schemas/video.schema';

@Injectable()
export class VideoService {
  async uploadVideoToS3(fileName: string, video: any) {
    const params: PutObjectRequest = await getS3Params(fileName, video);
    configuredS3.upload(params, (s3Err, s3Data) => {
      if (s3Err) {
        Logger.error(
          `${fileName} S3에 파일을 업로드하는 중 오류가 발생했습니다.`,
          s3Err,
        );
        throw new InternalServerErrorException();
      } else {
        Logger.log(s3Data);
      }
    });

    return '';
  }

  async saveVideo(videoSchema: VideoSchema) {
    return 1;
  }
}
