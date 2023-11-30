import { envSchema, envSchemaType } from '@src/config/env/zod-schema';

const parseEnv = (): envSchemaType => {
  const _env = envSchema.safeParse(process.env);

  if (_env.success === false) {
    // eslint-disable-next-line no-console
    console.error('🥶 Erro ao fazer o parse do env', _env.error.format());
    throw new Error('Erro ao fazer o parse do env');
  }

  return _env.data;
};

export const env = parseEnv();
