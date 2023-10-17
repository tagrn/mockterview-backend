import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/auth/auth.decorator';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserSchema } from 'src/user/schemas/user.schema';
import { v4 } from 'uuid';
import { VideoRequest } from './\brequests/video.request';
import { VideoSchema } from './schemas/video.schema';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'S3 데이터에 저장',
    type: VideoRequest,
  })
  @Post('/upload')
  async uploadVideoApi(
    @AuthorizedUser() user: UserSchema,
    @Param('questionSetId', ParseIntPipe) questionSetId: number,
    @Param('question') question: string,
    @UploadedFile() video,
  ): Promise<number> {
    const fileName = `${user.id}-${v4()}`;
    await this.videoService.uploadVideoToS3(fileName, video);

    return await this.videoService.saveVideo(
      new VideoSchema(user.id, questionSetId, question, fileName),
    );
  }
}
