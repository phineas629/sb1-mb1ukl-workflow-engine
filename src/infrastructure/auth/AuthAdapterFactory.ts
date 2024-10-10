import { AuthAdapter } from './AuthAdapter';
import { CognitoAuthAdapter } from './CognitoAuthAdapter';
import { IAMAuthAdapter } from './IAMAuthAdapter';
import { CasbinAuthAdapter } from './CasbinAuthAdapter';
import { MedplumAuthAdapter } from './MedplumAuthAdapter';

export class AuthAdapterFactory {
  static getAuthAdapter(type: string): AuthAdapter {
    switch (type.toLowerCase()) {
      case 'cognito':
        return new CognitoAuthAdapter();
      case 'iam':
        return new IAMAuthAdapter();
      case 'casbin':
        // You'll need to provide the model and policy paths
        return new CasbinAuthAdapter('./path/to/model.conf', './path/to/policy.csv');
      case 'medplum':
        return new MedplumAuthAdapter();
      default:
        throw new Error(`Unsupported auth adapter type: ${type}`);
    }
  }
}
