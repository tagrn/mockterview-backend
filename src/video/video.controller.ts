import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { AuthorizedUser } from '../auth/auth.decorator';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { UserSchema } from '../user/schemas/user.schema';
import { VideoRequest } from './\brequests/video.request';
import { VideoResponse } from './responses/video.response';
import { UnsavedVideoSchema } from './schemas/video.schema';
import { maxVideoCountValidate } from './validations/max-video-count.validation';
import { VideoService } from './video.service';

@ApiTags('VIDEO')
@Controller('videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('/')
  async getVideosApi(
    @AuthorizedUser() user: UserSchema,
  ): Promise<VideoResponse[]> {
    const videoSchemas = await this.videoService.getVideos(user.id);
    return videoSchemas.map(
      (videoSchema) =>
        new VideoResponse(
          videoSchema.id,
          videoSchema.userId,
          videoSchema.questionSetTitle,
          videoSchema.question,
          videoSchema.fileName,
        ),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @Get('/url')
  async getVideoUrlApi(
    @AuthorizedUser() user: UserSchema,
    @Query('videoId') videoId: number,
  ): Promise<string> {
    const videoSchema = await this.videoService.getVideo(videoId, user.id);
    if (!videoSchema) {
      throw new NotFoundException();
    }
    return this.configService.get('S3_OBJECT_URL') + videoSchema.fileName;
  }

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'S3 스토리지에 비디오 저장',
    type: VideoRequest,
  })
  @Post('/upload')
  async uploadVideoApi(
    @AuthorizedUser() user: UserSchema,
    @Query('question-set-title') questionSetTitle: string,
    @Query('question') question: string,
    @UploadedFile() video: Express.Multer.File,
  ): Promise<number> {
    const videoCount = await this.videoService.getVideoCount(user.id);
    await maxVideoCountValidate(videoCount, user.role);

    const fileName = `${user.id}-${v4()}`;
    await this.videoService.uploadVideoToS3(fileName, video);

    return await this.videoService.saveVideo(
      new UnsavedVideoSchema(user.id, questionSetTitle, question, fileName),
    );
  }
}
