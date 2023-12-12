import { logInfo } from '@src/utils/logs';
import TYPES from '@src/utils/types';

import { setupContainer } from './container';
import { ISetupKeycloakRealmUseCase } from './use-cases/setup-keycloak-realm/setup-keycloak-realm.interface';

export class SetupKeycloak {
  private readonly setupKeycloakRealmUseCase: ISetupKeycloakRealmUseCase;

  constructor() {
    this.setupKeycloakRealmUseCase = setupContainer.get<ISetupKeycloakRealmUseCase>(TYPES.SetupKeycloakRealmUseCase);
  }

  async execute(): Promise<void> {
    await this.setupKeycloakRealmUseCase.execute();

    logInfo('keycloak', 'Processo de setup finalizado 🚀');
  }
}
