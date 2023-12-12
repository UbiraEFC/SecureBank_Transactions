import { setIdentityConfig } from '@src/providers/identity/identity.config';
import { logInit } from '@src/utils/logs';

import { env } from './env';
import { luxonDefaultConfig } from './luxon/luxon-default-config';

export async function loadConfiguration(): Promise<void> {
  if (!process.env.NODE_ENV) throw new Error('NODE_ENV not defined');

  luxonDefaultConfig();

  setIdentityConfig(env);

  logInit('Envs loaded');
}
