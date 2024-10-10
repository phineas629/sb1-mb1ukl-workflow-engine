import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';

const defaultValues = {
  region: process.env.AWS_REGION || 'us-east-1',
  serviceName: process.env.SERVICE_NAME || 'workflow-engine',
};

export const logger = new Logger({
  ...defaultValues,
  logLevel: 'INFO',
});

export const tracer = new Tracer(defaultValues);

export const metrics = new Metrics(defaultValues);

export const captureLambdaHandler = (handler) => {
  return tracer.captureAWSv3Client(
    metrics.captureColdStartMetric(logger.injectLambdaContext(handler)),
  );
};
