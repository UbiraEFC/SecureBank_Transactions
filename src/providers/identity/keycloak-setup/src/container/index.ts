import { Container } from 'inversify';

import { IUserRepository } from '@src/db/repositories/interfaces/user';
import { UserRepository } from '@src/db/repositories/user';
import KeycloakProvider from '@src/providers/identity/implementations/keycloak/keycloak.provider';
import { IIdentityProvider } from '@src/providers/identity/interface/identity.interface';
import { logError, logInit } from '@src/utils/logs';
import TYPES from '@src/utils/types';

import { SetupKeycloakRealmUseCase } from '../use-cases/setup-keycloak-realm/setup-keycloak-realm-usecase';
import { ISetupKeycloakRealmUseCase } from '../use-cases/setup-keycloak-realm/setup-keycloak-realm.interface';

export const setupContainer = new Container();

export const keycloakSetupContainerBind = (container: Container): void => {
  try {
    container.bind<IIdentityProvider>(TYPES.IdentityProvider).to(KeycloakProvider);
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
    container.bind<ISetupKeycloakRealmUseCase>(TYPES.SetupKeycloakRealmUseCase).to(SetupKeycloakRealmUseCase);

    logInit('Keycloak setup container initialized');
  } catch (error) {
    logError('Keycloak setup container initialization failed', error);
  }
};
