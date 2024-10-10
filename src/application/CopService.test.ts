import { describe, it, expect } from 'vitest';
import { CopService } from './CopService';
import { CopRule } from '../domain/CopRule';

describe('CopService', () => {
  it('should add and enforce rules', () => {
    const copService = new CopService();

    const rule: CopRule = {
      id: '1',
      name: 'Test Rule',
      description: 'A test rule',
      condition: (context) => context.value > 10,
      action: (context) => ({ ...context, status: 'exceeded' }),
    };

    copService.addRule(rule);

    const context1 = { value: 5 };
    const result1 = copService.enforceRules(context1);
    expect(result1).toEqual(context1);

    const context2 = { value: 15 };
    const result2 = copService.enforceRules(context2);
    expect(result2).toEqual({ value: 15, status: 'exceeded' });
  });

  // Add more tests here...
});
