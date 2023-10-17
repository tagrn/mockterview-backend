import { PutObjectRequest, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  async getConfiguredS3Client(): Promise<S3Client> {
    return new S3Client({
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      },
      region: this.configService.get('S3_REGION'),
    });
  }

  async getS3Params(fileName: string, data: any): Promise<PutObjectRequest> {
    return {
      Bucket: this.configService.get('S3_BUCKET'),
      Key: fileName,
      Body: data,
    } as PutObjectRequest;
  }
}
