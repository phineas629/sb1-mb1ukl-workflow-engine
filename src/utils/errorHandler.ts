import logger from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error: Error | AppError): { statusCode: number; body: string } {
  if (error instanceof AppError) {
    logger.warn(error);
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ message: error.message }),
    };
  } else {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
