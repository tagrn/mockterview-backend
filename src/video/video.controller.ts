import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoRequest } from './\brequests/video.request';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthorizedUser } from 'src/auth/auth.decorator';
import { UserSchema } from 'src/user/schemas/user.schema';
import { VideoSchema } from './schemas/video.schema';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Post('/upload')
  async uploadVideoApi(
    @AuthorizedUser() user: UserSchema,
    @Body() videoRequest: VideoRequest,
  ): Promise<number> {
    const videoUrl = await this.videoService.uploadVideoToS3(
      videoRequest.video,
    );

    return await this.videoService.saveVideo(
      new VideoSchema(
        user.id,
        videoRequest.questionSetId,
        videoRequest.question,
        videoUrl,
      ),
    );
  }
}
