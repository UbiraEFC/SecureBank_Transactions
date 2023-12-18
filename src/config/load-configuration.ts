import { logInit } from '@src/utils/logs';

import { luxonDefaultConfig } from './luxon/luxon-default-config';

export async function loadConfiguration(): Promise<void> {
  if (!process.env.NODE_ENV) throw new Error('NODE_ENV not defined');

  luxonDefaultConfig();

  logInit('Envs loaded');
}
