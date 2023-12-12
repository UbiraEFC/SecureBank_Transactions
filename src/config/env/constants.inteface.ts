import { IIdentityProviderConfig } from '@src/providers/identity/interface/identity-config.interface';

export interface IConstants {
  env: string;
  port: string;
  appName: string;
  debug: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    databaseName: string;
    pool: {
      max: number;
      acquire: number;
      idle: number;
    };
  };

  // Providers
  identityProvider: IIdentityProviderConfig;
}
