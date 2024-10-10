import { User } from '../../domain/User';

export interface AuthAdapter {
  verifyToken(token: string): Promise<boolean>;
  createUser(
    username: string,
    password: string,
    attributes: Record<string, string>,
  ): Promise<string>;
  authenticateUser(username: string, password: string): Promise<string>;
  getUserInfo(token: string): Promise<User>;
  checkPermission(userId: string, resource: string, action: string): Promise<boolean>;
}
