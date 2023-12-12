import { typeormDataSource } from '@src/db/typeorm/data-source';
import { logError, logInit } from '@src/utils/logs';

import { keycloakSetupContainerBind, setupContainer } from './container';
import { SetupKeycloak } from './setup';

export async function bootstrap(): Promise<void> {
  await typeormDataSource
    .initialize()
    .then(() => {
      logInit('Database initialized');
    })
    .catch((err) => {
      logError('Database initialization failed', err);
    });

  keycloakSetupContainerBind(setupContainer);

  const setup = new SetupKeycloak();

  await setup.execute();
}
