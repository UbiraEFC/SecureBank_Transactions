export interface IConstants {
  env: string;
  port: string;
  apiUrl: string;
  adminEmail: string;
  adminPassword: string;
  backendPublicKey: string;
  frontendPublicKey: string;
  backendPrivateKey: string;
  frontendPrivateKey: string;
  hashSaltRounds: number;
  tokenExpirationInMinutes: number;
  refreshTokenExpirationInHours: string;
  refreshTokenExpirationInDays: string;
  jwtSecretToken: string;
  jwtSecretRefreshToken: string;
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
}
