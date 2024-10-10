import { APIGatewayV2 } from 'aws-sdk';
import { CloudProvider } from '../cloud/CloudProvider';

export class ApiGatewayV2Adapter {
  private apiGateway: APIGatewayV2;

  constructor(private cloudProvider: CloudProvider) {
    this.apiGateway = new APIGatewayV2();
  }

  async createApi(name: string, protocolType: string): Promise<string> {
    const params = {
      Name: name,
      ProtocolType: protocolType,
    };

    const result = await this.apiGateway.createApi(params).promise();
    return result.ApiId!;
  }

  async createRoute(apiId: string, routeKey: string, target: string): Promise<void> {
    const params = {
      ApiId: apiId,
      RouteKey: routeKey,
      Target: target,
    };

    await this.apiGateway.createRoute(params).promise();
  }

  async createIntegration(
    apiId: string,
    integrationType: string,
    integrationUri: string,
  ): Promise<string> {
    const params = {
      ApiId: apiId,
      IntegrationType: integrationType,
      IntegrationUri: integrationUri,
    };

    const result = await this.apiGateway.createIntegration(params).promise();
    return result.IntegrationId!;
  }

  async createStage(apiId: string, stageName: string): Promise<void> {
    const params = {
      ApiId: apiId,
      StageName: stageName,
      AutoDeploy: true,
    };

    await this.apiGateway.createStage(params).promise();
  }

  async getApiEndpoint(apiId: string): Promise<string> {
    const api = await this.apiGateway.getApi({ ApiId: apiId }).promise();
    return api.ApiEndpoint!;
  }
}
