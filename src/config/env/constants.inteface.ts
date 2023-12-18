export interface IConstants {
  env: string;
  port: string;
  apiUrl: string;
  hashSaltRounds: number;
  tokenExpirationInMinutes: number;
  refreshTokenExpirationInHours: number;
  refreshTokenExpirationInDays: number;
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
