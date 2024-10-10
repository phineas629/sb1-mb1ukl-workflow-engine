import { CloudProvider } from './CloudProvider';
import { AWSCloudProvider } from './aws/AWSCloudProvider';

export class CloudProviderFactory {
  static getCloudProvider(provider: string): CloudProvider {
    switch (provider.toLowerCase()) {
      case 'aws':
        return new AWSCloudProvider();
      // Add cases for other cloud providers as needed
      default:
        throw new Error(`Unsupported cloud provider: ${provider}`);
    }
  }
}
