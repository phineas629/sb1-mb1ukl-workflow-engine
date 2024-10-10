import { DatabaseAdapter } from '../infrastructure/database/DatabaseAdapter';
import { CloudStorageAdapter } from '../infrastructure/database/CloudStorageAdapter';
import { RDSAdapter } from '../infrastructure/database/RDSAdapter';
import { RedisAdapter } from '../infrastructure/database/RedisAdapter';
import cloudProvider from './cloudConfig';

export class DatabaseAdapterFactory {
  static createAdapter(type: string): DatabaseAdapter {
    switch (type) {
      case 'cloud':
        return new CloudStorageAdapter(cloudProvider);
      case 'rds':
        return new RDSAdapter(process.env.DATABASE_URL!);
      case 'redis':
        return new RedisAdapter(process.env.REDIS_URL!);
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
}

const databaseAdapter = DatabaseAdapterFactory.createAdapter(process.env.DATABASE_TYPE || 'cloud');

export default databaseAdapter;
