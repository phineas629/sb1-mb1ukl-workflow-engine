import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkflowService } from './WorkflowService';
import { WorkflowRepository } from '../infrastructure/WorkflowRepository';
import { WorkflowEngine } from './WorkflowEngine';
import { WorkflowDefinition } from '../domain/WorkflowDefinition';

vi.mock('../infrastructure/WorkflowRepository');
vi.mock('./WorkflowEngine');

describe('WorkflowService', () => {
  let workflowService: WorkflowService;
  let mockRepository: WorkflowRepository;
  let mockEngine: WorkflowEngine;

  beforeEach(() => {
    mockRepository = {
      saveWorkflowDefinition: vi.fn(),
      getWorkflowDefinition: vi.fn(),
      saveWorkflowInstance: vi.fn(),
      getWorkflowInstance: vi.fn(),
    } as unknown as WorkflowRepository;

    mockEngine = {
      createWorkflowActor: vi.fn(),
      executeStep: vi.fn(),
    } as unknown as WorkflowEngine;

    workflowService = new WorkflowService(mockRepository, mockEngine);
  });

  describe('createWorkflowDefinition', () => {
    it('should create a workflow definition', async () => {
      const definition: WorkflowDefinition = {
        id: '1',
        name: 'Test Workflow',
        initialState: 'start',
        context: {},
        states: {},
      };

      vi.mocked(mockRepository.saveWorkflowDefinition).mockResolvedValue(definition);

      const result = await workflowService.createWorkflowDefinition(definition);

      expect(result).toEqual(definition);
      expect(mockRepository.saveWorkflowDefinition).toHaveBeenCalledWith(definition);
    });
  });

  // Add more tests here...
});
