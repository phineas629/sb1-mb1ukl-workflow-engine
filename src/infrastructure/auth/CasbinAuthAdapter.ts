import { AuthAdapter } from '../auth/AuthAdapter';
import { User } from '../../domain/User';
import { newEnforcer, Enforcer } from 'casbin';
import * as bcrypt from 'bcrypt';

export class CasbinAuthAdapter implements AuthAdapter {
  private enforcer!: Enforcer;

  constructor(modelPath: string, policyPath: string) {
    this.initializeEnforcer(modelPath, policyPath);
  }

  private async initializeEnforcer(modelPath: string, policyPath: string) {
    this.enforcer = await newEnforcer(modelPath, policyPath);
  }

  async verifyToken(token: string): Promise<boolean> {
    // Implement token verification logic
    console.log(`Verifying token: ${token}`);
    return true;
  }

  async createUser(
    username: string,
    password: string,
    attributes: Record<string, string>,
  ): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Implement user creation logic
    console.log(`Creating user: ${username} with attributes:`, attributes);
    console.log(`Hashed password: ${hashedPassword}`);
    return 'user_id';
  }

  async authenticateUser(username: string, password: string): Promise<string> {
    const user = await this.getUser(username);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return this.generateToken(user);
  }

  async getUserInfo(token: string): Promise<User> {
    // Implement user info retrieval logic
    console.log(`Getting user info for token: ${token}`);
    return { id: 'user_id', attributes: {} };
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    return this.enforcer.enforce(userId, resource, action);
  }

  private async getUser(username: string): Promise<{ id: string; passwordHash: string } | null> {
    // Implement user retrieval logic
    console.log(`Getting user: ${username}`);
    return null;
  }

  private generateToken(user: { id: string }): string {
    // Implement token generation logic
    return `token_for_user_${user.id}`;
  }
}
