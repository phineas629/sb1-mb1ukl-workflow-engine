import { Policy, ConsecutiveBreaker, handleAll, retry, circuitBreaker } from 'cockatiel';
import logger from './logger';

export const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: 1000,
  onRetry: (err) => {
    logger.warn({ err }, 'Retrying operation');
  },
});

export const circuitBreakerPolicy = circuitBreaker(handleAll, {
  halfOpenAfter: 10000,
  breaker: new ConsecutiveBreaker(3),
  onBreak: (err) => {
    logger.error({ err }, 'Circuit breaker opened');
  },
  onReset: () => {
    logger.info('Circuit breaker reset');
  },
});

export const resilientPolicy = Policy.wrap(retryPolicy, circuitBreakerPolicy);

export async function withResilience<T>(operation: () => Promise<T>): Promise<T> {
  return resilientPolicy.execute(operation);
}
