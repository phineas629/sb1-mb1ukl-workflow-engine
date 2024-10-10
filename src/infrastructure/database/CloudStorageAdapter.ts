import { DatabaseAdapter } from './DatabaseAdapter';
import { CloudProvider } from '../cloud/CloudProvider';
import { CloudStorageRepository } from '../repositories/CloudStorageRepository';
import { S3Client } from '@aws-sdk/client-s3';
import { BaseRepository } from '../repositories/base/BaseRepository';

export class CloudStorageAdapter implements DatabaseAdapter {
  private s3Client: S3Client;

  constructor(private cloudProvider: CloudProvider) {
    this.s3Client = cloudProvider.getS3Client();
  }

  getRepository<T extends { id: string }>(name: string): BaseRepository<T> {
    return CloudStorageRepository.create<T>(this.s3Client, name);
  }

  async connect(): Promise<void> {
    // S3 doesn't require an explicit connection
  }

  async disconnect(): Promise<void> {
    // S3 doesn't require an explicit disconnection
  }
}
