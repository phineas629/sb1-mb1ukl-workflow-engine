import { Container } from 'inversify';
import { DatabaseAdapter } from '../database/DatabaseAdapter';
import { WorkflowService } from '../../application/WorkflowService';
import { WorkflowEngine } from '../../application/WorkflowEngine';
import { CopService } from '../../application/CopService';
import cloudProvider from '../../config/cloudConfig';
import authAdapter from '../../config/authConfig';
import { CloudStorageAdapter } from '../database/CloudStorageAdapter';
import { TYPES } from '../../types';

const container = new Container();

// Create and configure the CloudStorageAdapter
const cloudStorageAdapter = new CloudStorageAdapter(cloudProvider);

// Bind the DatabaseAdapter to the CloudStorageAdapter instance
container.bind<DatabaseAdapter>(TYPES.DatabaseAdapter).toConstantValue(cloudStorageAdapter);

// Bind the services
container.bind(TYPES.WorkflowService).to(WorkflowService);
container.bind(TYPES.WorkflowEngine).to(WorkflowEngine);
container.bind(TYPES.CopService).to(CopService);

// Bind cloud provider
container.bind(TYPES.CloudProvider).toConstantValue(cloudProvider);

// Bind auth adapter
container.bind(TYPES.AuthAdapter).toConstantValue(authAdapter);

export { container };
