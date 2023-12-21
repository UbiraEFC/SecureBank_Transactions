import { logInit } from '@src/utils/logs';

import { luxonDefaultConfig } from './luxon/luxon-default-config';
import { generateBackendKeys, generateFrontendKeys } from './secret/generate-keys';

export async function loadConfiguration(): Promise<void> {
  if (!process.env.NODE_ENV) throw new Error('NODE_ENV not defined');

  luxonDefaultConfig();

  generateBackendKeys();

  generateFrontendKeys();

  logInit('Envs loaded');
}
