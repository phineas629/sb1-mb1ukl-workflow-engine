import { Container } from 'inversify';
import { DatabaseAdapter } from '../infrastructure/database/DatabaseAdapter';
import { CloudStorageAdapter } from '../infrastructure/database/CloudStorageAdapter';
import { WorkflowService } from '../application/WorkflowService';
import { WorkflowEngine } from '../application/WorkflowEngine';
import { CopService } from '../application/CopService';
import cloudProvider from './cloudConfig';
import authAdapter from './authConfig';

const container = new Container();

// Bind the CloudStorageAdapter as the DatabaseAdapter
container
  .bind<DatabaseAdapter>(DatabaseAdapter)
  .toConstantValue(new CloudStorageAdapter(cloudProvider));

// Bind the services
container.bind(WorkflowService).toSelf();
container.bind(WorkflowEngine).toSelf();
container.bind(CopService).toSelf();

// Bind cloud provider
container.bind('CloudProvider').toConstantValue(cloudProvider);

// Bind auth adapter
container.bind('AuthAdapter').toConstantValue(authAdapter);

export { container };
