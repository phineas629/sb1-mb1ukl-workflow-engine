import { fromPromise } from 'xstate';
import { WorkflowTemplateRepository } from '../ports/WorkflowTemplateRepository';

export const checkTemplateVersionLogic = (workflowTemplateRepository: WorkflowTemplateRepository) =>
  fromPromise(async ({ input, self }) => {
    const latestVersion = await workflowTemplateRepository.getLatestVersion(input.templateId);
    if (latestVersion === null) {
      throw new Error('Template not found');
    }
    return { latestVersion, currentVersion: self.context.templateVersion };
  });
