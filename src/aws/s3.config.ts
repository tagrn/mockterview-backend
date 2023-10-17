import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

// AWS 자격 증명 설정 (환경 변수 또는 직접 설정)
export const configuredS3 = new S3({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
  region: 'YOUR_S3_REGION',
});

export const getS3Params = async (
  fileName: string,
  data: any,
): Promise<PutObjectRequest> => {
  return {
    Bucket: 'BUCKET_NAME',
    Key: fileName,
    Body: data,
  } as PutObjectRequest;
};
