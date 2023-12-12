import { envSchemaType } from '@src/config/env/zod-schema';

export const keycloakSetupEnv = (): envSchemaType => {
  return {
    NODE_ENV: 'keycloak-setup',
    API_PORT: '3000',
    APP_NAME: 'keycloak-setup',
    DEBUG: 'true',
    DATABASE_HOST: 'localhost',
    DATABASE_PORT: '5432',
    DATABASE_USER: 'DbSecure',
    DATABASE_PASSWORD: '7AwgmuJWgPUfIZqpWUoP',
    DATABASE_NAME: 'db_secure_bank',
    DATABASE_POOL_MAX: '5',
    DATABASE_ACQUIRE: '5000',
    DATABASE_IDLE: '30000',
    KEYCLOAK_REALM: 'SecureBank',
    KEYCLOAK_URL: 'http://localhost:8080/auth',
    KEYCLOAK_CLIENT_ID: 'securebank',
    KEYCLOAK_CLIENT_SECRET: 'securebank',
    KEYCLOAK_JWT_PUBLIC_KEY: 'jwt-public-key',
  };
};
