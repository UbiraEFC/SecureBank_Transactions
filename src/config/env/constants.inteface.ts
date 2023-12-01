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
}
