import { envSchemaType } from './zod-schema';

export const mockEnvs = (): envSchemaType => {
  return {
    NODE_ENV: 'test',
    API_PORT: '3025',
    API_URL: 'http://localhost:3025',
    ADMIN_EMAIL: 'admin@email',
    ADMIN_PASSWORD: 'admin',
    HASH_SALT_ROUNDS: '1',
    AUTHENTICATION_TOKEN_EXPIRATION_IN_MINUTES: '2',
    REFRESH_TOKEN_EXPIRATION_IN_HOURS: '8',
    REFRESH_TOKEN_EXPIRATION_IN_DAYS: '30',
    JWT_SECRET_TOKEN: 'test-secret',
    JWT_SECRET_REFRESH_TOKEN: 'test-secret-refresh',
    APP_NAME: 'TEST-SECURE-BANK-API',
    DATABASE_POOL_MAX: '20',
    DATABASE_ACQUIRE: '5000',
    DATABASE_IDLE: '30000',
    DATABASE_HOST: 'localhost',
    DATABASE_NAME: 'test_db',
    DATABASE_USER: 'test_user',
    DATABASE_PASSWORD: 'test_password',
    DATABASE_PORT: '5433',
  };
};
