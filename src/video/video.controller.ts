import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/auth/auth.decorator';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserSchema } from 'src/user/schemas/user.schema';
import { v4 } from 'uuid';
import { VideoRequest } from './\brequests/video.request';
import { VideoSchema } from './schemas/video.schema';
import { VideoService } from './video.service';

@ApiTags('VIDEO')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

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
    @Query('question') question: string,
    @UploadedFile() video,
  ): Promise<number> {
    const fileName = `${user.id}-${v4()}`;
    await this.videoService.uploadVideoToS3(fileName, video);

    return await this.videoService.saveVideo(
      new VideoSchema(user.id, question, fileName),
    );
  }
}
