import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'cloud',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  MEDPLUM_BASE_URL: process.env.MEDPLUM_BASE_URL,
  MEDPLUM_CLIENT_ID: process.env.MEDPLUM_CLIENT_ID,
};
