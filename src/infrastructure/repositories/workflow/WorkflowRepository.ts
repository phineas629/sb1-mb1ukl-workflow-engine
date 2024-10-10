import { injectable, inject } from 'inversify';
import { WorkflowInstance, WorkflowInstanceSchema } from '../../../domain/WorkflowInstance';
import { WorkflowDefinition } from '../../../domain/WorkflowDefinition';
import { DynamoDBRepository } from '../../database/DynamoDBRepository';
import { DatabaseAdapter } from '../../database/DatabaseAdapter';
import { TYPES } from '../../../types';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@injectable()
export class WorkflowRepository extends DynamoDBRepository<WorkflowInstance> {
  constructor(@inject(TYPES.DatabaseAdapter) private databaseAdapter: DatabaseAdapter) {
    super('Workflows', 'WorkflowInstance', databaseAdapter.client as DynamoDBDocumentClient);
  }

  protected validateWorkflowInstance(instance: WorkflowInstance): WorkflowInstance {
    return WorkflowInstanceSchema.parse(instance);
  }

  async create(item: WorkflowInstance): Promise<WorkflowInstance> {
    const validatedItem = this.validateWorkflowInstance(item);
    const params = {
      TableName: this.tableName,
      Item: {
        ...validatedItem,
        PK: `${this.entityName}#${validatedItem.id}`,
        SK: `${this.entityName}#${validatedItem.id}`,
        GSI1PK: this.generateGSI1PK(),
        GSI1SK: validatedItem.id,
        entityType: this.entityName,
      },
    };

    try {
      await this.databaseAdapter.client.send(new PutCommand(params));
      return validatedItem;
    } catch (error) {
      console.error('Error creating workflow instance:', error);
      throw new Error('Failed to create workflow instance');
    }
  }

  async getById(id: string): Promise<WorkflowInstance | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `${this.entityName}#${id}`,
        SK: `${this.entityName}#${id}`,
      },
    };

    try {
      const result = await this.databaseAdapter.client.send(new GetCommand(params));
      return result.Item as WorkflowInstance | null;
    } catch (error) {
      console.error('Error getting workflow instance by ID:', error);
      throw new Error('Failed to get workflow instance by ID');
    }
  }

  async update(id: string, item: Partial<WorkflowInstance>): Promise<WorkflowInstance> {
    const existingItem = await this.getById(id);
    if (!existingItem) {
      throw new Error('Workflow instance not found');
    }

    const updatedItem = { ...existingItem, ...item };
    const validatedItem = this.validateWorkflowInstance(updatedItem);

    const params = {
      TableName: this.tableName,
      Key: {
        PK: `${this.entityName}#${id}`,
        SK: `${this.entityName}#${id}`,
      },
      UpdateExpression:
        'set #definitionId = :definitionId, #currentState = :currentState, #context = :context, #history = :history',
      ExpressionAttributeNames: {
        '#definitionId': 'definitionId',
        '#currentState': 'currentState',
        '#context': 'context',
        '#history': 'history',
      },
      ExpressionAttributeValues: {
        ':definitionId': validatedItem.definitionId,
        ':currentState': validatedItem.currentState,
        ':context': validatedItem.context,
        ':history': validatedItem.history,
      },
    };

    try {
      await this.databaseAdapter.client.send(new UpdateCommand(params));
      return validatedItem;
    } catch (error) {
      console.error('Error updating workflow instance:', error);
      throw new Error('Failed to update workflow instance');
    }
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `${this.entityName}#${id}`,
        SK: `${this.entityName}#${id}`,
      },
    };

    try {
      await this.databaseAdapter.client.send(new DeleteCommand(params));
    } catch (error) {
      console.error('Error deleting workflow instance:', error);
      throw new Error('Failed to delete workflow instance');
    }
  }

  async list(): Promise<WorkflowInstance[]> {
    const params = {
      TableName: this.tableName,
      FilterExpression: 'entityType = :entityType',
      ExpressionAttributeValues: {
        ':entityType': this.entityName,
      },
    };

    try {
      const result = await this.databaseAdapter.client.send(new ScanCommand(params));
      return result.Items as WorkflowInstance[];
    } catch (error) {
      console.error('Error listing workflow instances:', error);
      throw new Error('Failed to list workflow instances');
    }
  }

  protected generateGSI1PK(): string {
    return 'WORKFLOWINSTANCE';
  }

  async getWorkflowDefinition(definitionId: string): Promise<WorkflowDefinition | null> {
    // Implement logic to fetch workflow definition
    console.log(`Fetching workflow definition: ${definitionId}`);
    return null;
  }

  async createWorkflowDefinition(definition: WorkflowDefinition): Promise<string> {
    // Implement the creation logic
    console.log('Creating workflow definition:', definition);
    return 'dummy-id';
  }

  async listWorkflowDefinitions(): Promise<WorkflowDefinition[]> {
    // Implement the listing logic
    return [];
  }

  async updateWorkflowDefinition(
    id: string,
    definition: Partial<WorkflowDefinition>,
  ): Promise<void> {
    // Implement the update logic
    console.log(`Updating workflow definition ${id}:`, definition);
  }
}
