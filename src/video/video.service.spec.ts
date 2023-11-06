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
    it('정상적인 id와 유저 id가 들어갔을 경우', async () => {
      jest.spyOn(videoRepository, 'findOneBy').mockResolvedValue(mockVideo);

      const result = await service.getVideo(1, 1);

      expect(videoRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });

      expect(result.id).toBe(id);
      expect(result.userId).toBe(userId);
      expect(result.question).toBe(question);
      expect(result.questionSetTitle).toBe(questionSetTitle);
      expect(result.fileName).toBe(fileName);
    });
  });
});
