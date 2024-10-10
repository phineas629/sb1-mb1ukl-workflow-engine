// ... other imports

export class DynamoDBWorkflowRepository implements WorkflowRepository {
  constructor(
    private dynamoDb: DynamoDB.DocumentClient,
    private workflowStateMachineFactory: WorkflowStateMachineFactory,
    private workflowTemplateRepository: WorkflowTemplateRepository,
  ) {}

  async findById(id: string): Promise<WorkflowAggregate | null> {
    const key = createWorkflowKey(id);
    const result = await this.dynamoDb
      .get({
        TableName: 'Workflows',
        Key: key,
      })
      .promise();

    if (!result.Item) {
      return null;
    }

    const template = await this.workflowTemplateRepository.findById(result.Item.templateId);
    if (!template) {
      throw new Error('Workflow template not found');
    }

    // ... rest of the method
  }

  // ... other methods
}
