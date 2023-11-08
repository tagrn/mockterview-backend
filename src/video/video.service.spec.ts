import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { AwsService } from 'src/aws/aws.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from 'src/entities/video';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

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

describe('VideoService', () => {
  let service: VideoService;
  let videoRepository: Repository<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        { provide: AwsService, useValue: {} },
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
});
