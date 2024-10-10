// ... other imports

export class DynamoDBWorkflowTemplateRepository implements WorkflowTemplateRepository {
  // ... constructor and other methods

  async findById(id: string): Promise<WorkflowTemplate | null> {
    // ... existing code

    if (!result.Item) {
      return null;
    }

    workflowTemplateKeySchema.parse(result.Item);
    const template = WorkflowTemplate.fromData(result.Item as WorkflowTemplateData);
    await this.setAsync(`workflow_template:${id}`, JSON.stringify(template.toData()));
    await this.setAsync(`workflow_template:${id}:version`, template.version.toString());

    return template;
  }

  // ... other methods
}
