import 'reflect-metadata';
import '@src/config/module.alias';
import { bootstrap } from '@src/server';

import { logError, logInit } from '@utils/logs';

logInit('# SecureBank-API #');

bootstrap().catch((err) => {
  logError('bootstrap', err.message);
});
