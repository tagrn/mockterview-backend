import { PutObjectCommand, PutObjectRequest } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { User } from 'src/entities/user.entity';
import { Video } from 'src/entities/video';
import { UnsavedVideoSchema } from 'src/video/schemas/video.schema';
import { Repository } from 'typeorm';
import { VideoService } from './video.service';

const id = 1;
const userId = 1;
const questionSetTitle = '모의 면접 1';
const question = '자기소개 부탁드립니다.';
const fileName = '1-vcxkjh12jxnvcjkhs29d8fd';
const mockVideo: Video = {
  id,
  userId,
  questionSetTitle,
  question,
  fileName,
  user: new User(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
};

class MockS3Client {
  async send(command: PutObjectCommand) {
    if (!command.input.Body) {
      throw new Error('Invalid Body');
    }
    if (!command.input.Bucket) {
      throw new Error('Invalid Bucket');
    }
    if (!command.input.Key) {
      throw new Error('Invalid Key');
    }
    return;
  }
  destory(): void {
    return;
  }
}
const mockS3Client = new MockS3Client();

const mockBucket = 'mockBucket';
const video: any = 'data';
const putObjectRequest = {
  Bucket: mockBucket,
  Key: fileName,
  Body: video,
} as PutObjectRequest;

describe('VideoService', () => {
  let service: VideoService;
  let videoRepository: Repository<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: AwsService,
          useValue: {
            getS3PutParams: async (_, __) => putObjectRequest,
            getConfiguredS3Client: async () => mockS3Client,
          },
        },
        {
          provide: getRepositoryToken(Video),
          useClass: Repository<Video>,
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVideo', () => {
    it('존재하는 id와 정상적인 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findOneBy').mockResolvedValue(mockVideo);

      const result = await service.getVideo(id, userId);

      expect(videoRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({
        id,
        userId,
      });

      expect(result.id).toBe(id);
      expect(result.userId).toBe(userId);
      expect(result.question).toBe(question);
      expect(result.questionSetTitle).toBe(questionSetTitle);
      expect(result.fileName).toBe(fileName);
    });

    it('존재하는 id와 비정상적인 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findOneBy').mockResolvedValue(null);

      const wrongUserId = 999999;
      const result = await service.getVideo(id, wrongUserId);

      expect(videoRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({
        id,
        userId: wrongUserId,
      });

      expect(result).toBe(null);
    });

    it('존재하지 않는 id와 정상적인 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findOneBy').mockResolvedValue(null);

      const wrongVideoId = 888888;
      const result = await service.getVideo(wrongVideoId, 1);

      expect(videoRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({
        id: wrongVideoId,
        userId: 1,
      });

      expect(result).toBe(null);
    });

    it('존재하지 않는 id와 비정상적인 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findOneBy').mockResolvedValue(null);

      const wrongVideoId = 888888;
      const wrongUserId = 999999;
      const result = await service.getVideo(wrongVideoId, wrongUserId);

      expect(videoRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({
        id: wrongVideoId,
        userId: wrongUserId,
      });

      expect(result).toBe(null);
    });
  });

  describe('getVideoCount', () => {
    it('존재하는 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'countBy').mockResolvedValue(2);

      const result = await service.getVideoCount(userId);

      expect(videoRepository.countBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.countBy).toHaveBeenCalledWith({
        userId,
      });

      expect(result).toBe(2);
    });

    it('존재하지 않는 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'countBy').mockResolvedValue(0);

      const wrongUserId = 999999;
      const result = await service.getVideoCount(wrongUserId);

      expect(videoRepository.countBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.countBy).toHaveBeenCalledWith({
        userId: wrongUserId,
      });

      expect(result).toBe(0);
    });

    it('영상 저장을 하나도 하지 않은 경우', async () => {
      jest.spyOn(videoRepository, 'countBy').mockResolvedValue(0);

      const result = await service.getVideoCount(userId);

      expect(videoRepository.countBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.countBy).toHaveBeenCalledWith({
        userId,
      });

      expect(result).toBe(0);
    });
  });

  describe('getVideos', () => {
    it('존재하는 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findBy').mockResolvedValue([mockVideo]);

      const result = await service.getVideos(userId);

      expect(videoRepository.findBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findBy).toHaveBeenCalledWith({
        userId,
      });

      expect(result[0].id).toBe(id);
      expect(result[0].userId).toBe(userId);
      expect(result[0].question).toBe(question);
      expect(result[0].questionSetTitle).toBe(questionSetTitle);
      expect(result[0].fileName).toBe(fileName);
    });

    it('존재하지 않는 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findBy').mockResolvedValue([]);

      const wrongUserId = 999999;
      const result = await service.getVideos(wrongUserId);

      expect(videoRepository.findBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findBy).toHaveBeenCalledWith({
        userId: wrongUserId,
      });

      expect(result.length).toBe(0);
    });

    it('영상이 하나도 없을 경우', async () => {
      jest.spyOn(videoRepository, 'findBy').mockResolvedValue([]);

      const result = await service.getVideos(userId);

      expect(videoRepository.findBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findBy).toHaveBeenCalledWith({
        userId,
      });

      expect(result.length).toBe(0);
    });
  });

  describe('saveVideo', () => {
    const unsavedVideo: UnsavedVideoSchema = new UnsavedVideoSchema(
      userId,
      questionSetTitle,
      question,
      fileName,
    );
    it('정상적인 데이터로 저장 성공', async () => {
      jest.spyOn(videoRepository, 'save').mockResolvedValue(mockVideo);

      const result = await service.saveVideo(unsavedVideo);

      expect(videoRepository.save).toHaveBeenCalledTimes(1);
      expect(videoRepository.save).toHaveBeenCalledWith({
        ...unsavedVideo,
      });

      expect(result).toBe(id);
    });

    it('존재하지 않는 유저 id가 들어갔을 경우', async () => {
      jest
        .spyOn(videoRepository, 'save')
        .mockRejectedValue(new Error('foriegn key error'));

      const wrongUserId = 999999;
      unsavedVideo.userId = wrongUserId;
      try {
        await service.saveVideo(unsavedVideo);
      } catch (e) {
        expect(e.message).toBe('foriegn key error');
      }

      expect(videoRepository.save).toHaveBeenCalledTimes(1);
      expect(videoRepository.save).toHaveBeenCalledWith({
        ...unsavedVideo,
      });
    });
  });

  describe('uploadVideoToS3', () => {
    it('영상 업로드 요청 성공', async () => {
      jest.spyOn(mockS3Client, 'send');

      await service.uploadVideoToS3(fileName, video);
    });

    it('영상 업로드 요청 실패', async () => {
      jest.spyOn(mockS3Client, 'send').mockRejectedValue(new Error());

      try {
        await service.uploadVideoToS3(fileName, video);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
