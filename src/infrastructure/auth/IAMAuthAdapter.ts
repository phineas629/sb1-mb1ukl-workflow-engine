import { injectable } from 'inversify';
import { AuthAdapter } from './AuthAdapter';
import { IAM, STS } from 'aws-sdk';
import { User } from '../../domain/User';

@injectable()
export class IAMAuthAdapter implements AuthAdapter {
  private iam: IAM;
  private sts: STS;

  constructor() {
    this.iam = new IAM();
    this.sts = new STS();
  }

  async registerUser(
    username: string,
    password: string,
    attributes: Record<string, string>,
  ): Promise<void> {
    console.log(`Registering user: ${username}`);
    console.log(`Password length: ${password.length}`);
    console.log('Attributes:', attributes);

    // Implement user registration logic using IAM
    await this.iam
      .createUser({
        UserName: username,
        Tags: Object.entries(attributes).map(([Key, Value]) => ({ Key, Value })),
      })
      .promise();

    // Set the user password
    await this.iam
      .createLoginProfile({
        UserName: username,
        Password: password,
        PasswordResetRequired: true,
      })
      .promise();
  }

  async loginUser(username: string, password: string): Promise<string> {
    console.log(`User attempting login: ${username}`);

    // Implement login logic
    // IAM does not support direct login, so this is a placeholder
    const token = `${username}-${password}-token`;
    console.log(`Generated token for user ${username}: ${token}`);

    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    console.log(`Validating token: ${token}`);

    // ... existing validation logic ...

    // Return a dummy validation result
    return token.length > 0;
  }

  async authorize(userId: string, resource: string, action: string): Promise<boolean> {
    console.log(`Authorizing user ${userId} for action ${action} on resource ${resource}`);

    // ... existing authorization logic ...

    // Return a dummy authorization result
    return true;
  }

  async verifyToken(token: string): Promise<boolean> {
    console.log(`Verifying token: ${token}`);

    try {
      // Decode the token using STS
      const decodedToken = await this.sts
        .decodeAuthorizationMessage({ EncodedMessage: token })
        .promise();

      console.log('Decoded token:', decodedToken.DecodedMessage);

      // Implement additional verification logic if needed
      // For example, check if the token contains specific claims or is not expired

      return true; // Return true if the token is valid
    } catch (error) {
      console.error('Failed to verify token:', error);
      return false; // Return false if the token is invalid
    }
  }

  async createUser(
    username: string,
    password: string,
    attributes: Record<string, string>,
  ): Promise<string> {
    console.log(`Creating IAM user: ${username}`);
    console.log(`Password length: ${password.length}`);
    console.log('Attributes:', attributes);

    // Create IAM user
    const user = await this.iam
      .createUser({
        UserName: username,
        Tags: Object.entries(attributes).map(([Key, Value]) => ({ Key, Value })),
      })
      .promise();

    if (!user.User) {
      throw new Error('Failed to create IAM user');
    }

    // Set the user password
    await this.iam
      .createLoginProfile({
        UserName: username,
        Password: password,
        PasswordResetRequired: false,
      })
      .promise();

    console.log(`Created IAM user with ID: ${user.User.UserId}`);
    return user.User.UserId || '';
  }

  async authenticateUser(username: string, password: string): Promise<string> {
    console.log(`Authenticating IAM user: ${username}`);

    // IAM does not support direct authentication, this is a placeholder
    const authToken = `${username}-${password}-token`;
    console.log(`Generated auth token for user ${username}: ${authToken}`);

    return authToken;
  }

  async getUserInfo(token: string): Promise<User> {
    console.log(`Retrieving user info with token: ${token}`);

    // Implement user info retrieval logic using IAM
    // Extract user ID from token (assuming token contains the user ID)
    const userId = this.extractUserIdFromToken(token);

    const userResponse = await this.iam.getUser({ UserName: userId }).promise();

    if (!userResponse.User) {
      throw new Error(`User not found for ID: ${userId}`);
    }

    const attributes = userResponse.User.Tags?.reduce(
      (attrs, tag) => ({ ...attrs, [tag.Key]: tag.Value }),
      {},
    );

    return {
      id: userResponse.User.UserId!,
      attributes: attributes || {},
    };
  }

  private extractUserIdFromToken(token: string): string {
    // Placeholder logic to extract user ID from token
    // This should be replaced with actual logic to decode the token and extract the user ID
    return token.split('-')[0];
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    console.log(`Authorizing user ${userId} for action ${action} on resource ${resource}`);

    // Implement permission check logic using IAM
    const hasPermission = true; // Replace with actual logic

    return hasPermission;
  }
}
