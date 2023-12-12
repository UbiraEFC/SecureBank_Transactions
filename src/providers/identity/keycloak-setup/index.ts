import 'reflect-metadata';

import { bootstrap } from '@src/providers/identity/keycloak-setup/src/app';
import { logError } from '@src/utils/logs';

bootstrap().catch((err) => {
  logError('bootstrap', err.message);
});
