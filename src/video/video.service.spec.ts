import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { AwsService } from 'src/aws/aws.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from 'src/entities/video';
import { Repository } from 'typeorm';

describe('VideoService', () => {
  let service: VideoService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
