import { Injectable } from '@nestjs/common';
import { VideoSchema } from './schemas/video.schema';

@Injectable()
export class VideoService {
  async uploadVideoToS3(video: BinaryData) {
    return '';
  }

  async saveVideo(videoSchema: VideoSchema) {
    return 1;
  }
}
