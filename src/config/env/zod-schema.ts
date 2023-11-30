import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  API_PORT: z.string().default('3025'),
  APP_NAME: z.string().default('API'),
  DEBUG: z.string().default('false'),
});

export type envSchemaType = typeof envSchema._output;
