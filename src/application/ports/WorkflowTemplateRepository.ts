import { WorkflowTemplate } from '../../domain/workflow/entities/WorkflowTemplate';

export interface WorkflowTemplateRepository {
  save(template: WorkflowTemplate): Promise<void>;
  findById(id: string): Promise<WorkflowTemplate | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<WorkflowTemplate[]>;
}
