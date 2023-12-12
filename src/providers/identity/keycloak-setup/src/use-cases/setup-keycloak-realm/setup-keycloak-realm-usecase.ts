import { inject, injectable } from 'inversify';

import ConstantsEnv from '@src/config/env/constants';
import { IIdentityProvider } from '@src/providers/identity/interface/identity.interface';
import TYPES from '@src/utils/types';

import { ISetupKeycloakRealmUseCase } from './setup-keycloak-realm.interface';

@injectable()
export class SetupKeycloakRealmUseCase implements ISetupKeycloakRealmUseCase {
  constructor(@inject(TYPES.IdentityProvider) private readonly identityProvider: IIdentityProvider) {}

  async execute(): Promise<void> {
    const { clientId, clientSecret, realm } = ConstantsEnv.identityProvider.keycloak;

    if (!clientId || !clientSecret || !realm) {
      throw new Error(
        'Não é possível fazer o setup do keycloak sem clientId, clientSecret ou realm definida no arquivo de configuração.',
      );
    }

    // Create realm
    await this.identityProvider.auth();
    await this.identityProvider.addRealm(realm);

    // Setup realm
    // Obs: Need to authenticate again because new realm was created before
    await this.identityProvider.auth();
    await this.identityProvider.addRole('admin', realm);
    await this.identityProvider.addRole('user', realm);

    // Create clients
    await this.identityProvider.addFrontendClient('client-frontend-mobile', realm);
    await this.identityProvider.addFrontendClient('client-frontend-web', realm);
    await this.identityProvider.addBackendClient('client-backend-mobile', realm);
    await this.identityProvider.addBackendClient('client-backend-web', realm);

    // Setup roles
    await this.identityProvider.auth();
    await this.identityProvider.addRolesToClient('client-backend-mobile', realm);
    await this.identityProvider.addRolesToClient('client-backend-web', realm);
  }
}
