import { envSchema, envSchemaType } from '@src/config/env/zod-schema';
import { keycloakSetupEnv } from '@src/providers/identity/keycloak-setup/src/env/setup-env';

const parseEnv = (): envSchemaType => {
  const _env = envSchema.safeParse(process.env);

  console.log('🚀 ~ file: index.ts ~ line 10 ~ parseEnv ~ _env', _env);

  if (_env.success === false) {
    // eslint-disable-next-line no-console
    console.error('🥶 Erro ao fazer o parse do env', _env.error.format());
    throw new Error('Erro ao fazer o parse do env');
  }

  return _env.data;
};

export const env = process.env.NODE_ENV === 'keycloak-setup' ? keycloakSetupEnv() : parseEnv();
