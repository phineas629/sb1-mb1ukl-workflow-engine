import { injectable } from 'inversify';
import { AuthAdapter } from './AuthAdapter';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { User } from '../../domain/User';
import { verifyToken } from '../../utils/cognitoAuth';

@injectable()
export class CognitoAuthAdapter implements AuthAdapter {
  private cognito: CognitoIdentityServiceProvider;

  constructor() {
    this.cognito = new CognitoIdentityServiceProvider();
  }

  async registerUser(
    username: string,
    password: string,
    attributes: Record<string, string>,
  ): Promise<void> {
    console.log(`Registering user: ${username}`);
    console.log(`Password length: ${password.length}`);
    console.log('Attributes:', attributes);

    // Implement user registration logic using Cognito
    await this.cognito
      .adminCreateUser({
        UserPoolId: 'your_user_pool_id',
        Username: username,
        UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
        TemporaryPassword: password,
        MessageAction: 'SUPPRESS',
      })
      .promise();
  }

  async loginUser(username: string, password: string): Promise<string> {
    console.log(`User attempting login: ${username}`);

    // Implement user authentication using Cognito
    const response = await this.cognito
      .adminInitiateAuth({
        UserPoolId: 'your_user_pool_id',
        ClientId: 'your_client_id',
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      })
      .promise();

    const token = response.AuthenticationResult?.IdToken || '';
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
    return verifyToken(token);
  }

  async createUser(
    username: string,
    password: string,
    attributes: Record<string, string>,
  ): Promise<string> {
    console.log(`Creating user: ${username}`);
    console.log(`Password length: ${password.length}`);
    console.log('Attributes:', attributes);

    // Implement user creation logic using Cognito
    const response = await this.cognito
      .signUp({
        ClientId: 'your_client_id',
        Username: username,
        Password: password,
        UserAttributes: Object.entries(attributes).map(([Name, Value]) => ({ Name, Value })),
      })
      .promise();

    const userId = response.UserSub;
    console.log(`Created user with ID: ${userId}`);

    return userId;
  }

  async authenticateUser(username: string, password: string): Promise<string> {
    console.log(`Authenticating user: ${username}`);

    // Implement user authentication logic using Cognito
    const response = await this.cognito
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: 'your_client_id',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      })
      .promise();

    const authToken = response.AuthenticationResult?.IdToken || '';
    console.log(`Generated auth token for user ${username}: ${authToken}`);

    return authToken;
  }

  async getUserInfo(token: string): Promise<User> {
    console.log(`Retrieving user info with token: ${token}`);

    // Implement logic to get user information using Cognito
    const userInfo = await this.cognito.getUser({ AccessToken: token }).promise();

    return {
      id: userInfo.Username,
      attributes: userInfo.UserAttributes?.reduce(
        (attrs, attr) => ({ ...attrs, [attr.Name]: attr.Value }),
        {},
      ),
    };
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    console.log(`Authorizing user ${userId} for action ${action} on resource ${resource}`);

    // Implement permission check logic
    const hasPermission = true; // Replace with actual logic

    return hasPermission;
  }
}
