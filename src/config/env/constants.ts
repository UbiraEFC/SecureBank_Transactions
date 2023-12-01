import { IConstants } from '@src/config/env/constants.inteface';

import { env } from '.';

const ContantsEnv: IConstants = {
  env: env.NODE_ENV,
  port: env.API_PORT,
  appName: env.APP_NAME,
  debug: env.DEBUG,
  database: {
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    databaseName: env.DATABASE_NAME,
    pool: {
      max: Number(env.DATABASE_POOL_MAX),
      acquire: Number(env.DATABASE_ACQUIRE),
      idle: Number(env.DATABASE_IDLE),
    },
  },
};

export default ContantsEnv;
