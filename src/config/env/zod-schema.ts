import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  API_PORT: z.string().default('3025'),
  APP_NAME: z.string().default('API'),
  DEBUG: z.string().default('false'),

  DATABASE_HOST: z.string().optional(),
  DATABASE_PORT: z.string().default('5432'),
  DATABASE_NAME: z.string().optional(),
  DATABASE_USER: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_POOL_MAX: z.string().default('40'),
  DATABASE_ACQUIRE: z.string().default('5000'),
  DATABASE_IDLE: z.string().default('30000'),

  KEYCLOAK_REALM: z.string().optional(),
  KEYCLOAK_URL: z.string().optional(),
  KEYCLOAK_CLIENT_ID: z.string().optional(),
  KEYCLOAK_CLIENT_SECRET: z.string().optional(),
  KEYCLOAK_JWT_PUBLIC_KEY: z.string().optional(),
});

export type envSchemaType = typeof envSchema._output;
