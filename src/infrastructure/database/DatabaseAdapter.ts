import { BaseRepository } from '../repositories/base/BaseRepository';

export interface DatabaseAdapter {
  getRepository<T extends { id: string }>(name: string): BaseRepository<T>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
