import { fromPromise } from 'xstate';
import { WorkflowTemplateRepository } from '../ports/WorkflowTemplateRepository';

export const updateTemplateLogic = (workflowTemplateRepository: WorkflowTemplateRepository) =>
  fromPromise(async ({ input }) => {
    const updatedTemplate = await workflowTemplateRepository.findById(input.templateId);
    if (!updatedTemplate) {
      throw new Error('Template not found');
    }
    return updatedTemplate;
  });
