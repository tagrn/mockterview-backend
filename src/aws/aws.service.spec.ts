import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';

const S3_ACCESS_KEY = 'dummy S3_ACCESS_KEY';
const S3_SECRET_KEY = 'dummy S3_SECRET_KEY';
const S3_REGION = 'dummy S3_REGION';
const S3_BUCKET = 'dummy S3_BUCKET';

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'S3_ACCESS_KEY') {
                return S3_ACCESS_KEY;
              } else if (key === 'S3_SECRET_KEY') {
                return S3_SECRET_KEY;
              } else if (key === 'S3_REGION') {
                return S3_REGION;
              } else if (key === 'S3_BUCKET') {
                return S3_BUCKET;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
