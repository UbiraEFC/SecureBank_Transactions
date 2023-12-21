import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  API_PORT: z.string().default('3025'),
  API_URL: z.string().default('http://localhost:3025'),
  ADMIN_EMAIL: z.string().default(''),
  ADMIN_PASSWORD: z.string().default(''),
  BACKEND_PUBLIC_KEY: z.string().default(''),
  FRONTEND_PUBLIC_KEY: z.string().default(''),
  BACKEND_PRIVATE_KEY: z.string().default(''),
  FRONTEND_PRIVATE_KEY: z.string().default(''),
  AUTHENTICATION_TOKEN_EXPIRATION_IN_MINUTES: z.string().default('2m'),
  REFRESH_TOKEN_EXPIRATION_IN_HOURS: z.string().default('8h'),
  REFRESH_TOKEN_EXPIRATION_IN_DAYS: z.string().default('30d'),
  JWT_SECRET_TOKEN: z.string().default('secret'),
  JWT_SECRET_REFRESH_TOKEN: z.string().default('secret-refresh'),
  HASH_SALT_ROUNDS: z.string().default('10'),
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
});

export type envSchemaType = typeof envSchema._output;
