import { CloudClient } from '../CloudClient';
import { DynamoDB, Lambda, CognitoIdentityServiceProvider, IAM } from 'aws-sdk';

export class AWSCloudClient implements CloudClient {
  private dynamodb: DynamoDB.DocumentClient;
  private lambda: Lambda;
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private iam: IAM;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.lambda = new Lambda();
    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    this.iam = new IAM();
  }

  getStorageClient(): DynamoDB.DocumentClient {
    return this.dynamodb;
  }

  getFunctionClient(): Lambda {
    return this.lambda;
  }

  getAuthClient(): CognitoIdentityServiceProvider {
    return this.cognitoIdentityServiceProvider;
  }

  getIdentityClient(): IAM {
    return this.iam;
  }
}
