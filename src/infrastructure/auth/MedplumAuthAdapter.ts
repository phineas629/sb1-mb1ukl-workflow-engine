import { AuthAdapter } from './AuthAdapter';
import { User } from '../../domain/User';
import { MedplumClient } from '@medplum/core';

export class MedplumAuthAdapter implements AuthAdapter {
  private client: MedplumClient;

  constructor() {
    this.client = new MedplumClient({
      baseUrl: process.env.MEDPLUM_BASE_URL,
      clientId: process.env.MEDPLUM_CLIENT_ID,
    });
  }

  // ... other methods

  async getUserInfo(token: string): Promise<User> {
    try {
      // Set the access token for the client
      this.client.setAccessToken(token);

      // Fetch the user profile
      const profile = await this.client.getProfile();

      return {
        id: profile.id,
        attributes: {
          email: profile.email,
          name: profile.name,
          resourceType: profile.resourceType,
          // Add other relevant attributes here
        },
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user info');
    }
  }

  // ... other methods
}
