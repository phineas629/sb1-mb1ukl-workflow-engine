import { injectable } from 'inversify';
import { CopRule } from '../domain/CopRule';
import logger from '../utils/logger';

@injectable()
export class CopService {
  private rules: CopRule[] = [];

  addRule(rule: CopRule): void {
    this.rules.push(rule);
    logger.info({ ruleId: rule.id }, 'Cop rule added');
  }

  enforceRules<T extends Record<string, unknown>>(context: T): T {
    let updatedContext = { ...context };
    for (const rule of this.rules) {
      if (rule.condition(updatedContext)) {
        logger.info({ ruleId: rule.id }, 'Cop rule enforced');
        updatedContext = rule.action(updatedContext) as T;
      }
    }
    return updatedContext;
  }
}
