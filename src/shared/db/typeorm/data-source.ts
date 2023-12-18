import * as path from 'path';
import { DataSource } from 'typeorm';

import ConstantsEnv from '@src/config/env/constants';
import * as entitiesClasses from '@src/shared/db/entities';
import LoggerManager from '@src/utils/logger-manager';

export const typeormDataSource = new DataSource({
  type: 'postgres',
  uuidExtension: 'uuid-ossp',

  host: ConstantsEnv.database.host,
  username: ConstantsEnv.database.username,
  password: ConstantsEnv.database.password,
  database: ConstantsEnv.database.databaseName,
  port: ConstantsEnv.database.port,

  migrations:
    process.env.NODE_ENV === 'test'
      ? ['dist/shared/db/typeorm/migrations/*.js']
      : [path.join(__dirname, 'migrations/*.{ts,js}')],

  entities: process.env.NODE_ENV === 'test' ? entitiesClasses : [path.join(__dirname, '..', 'entities/*.{ts,js}')],

  logger: ConstantsEnv.debug ? LoggerManager.databaseLogger : undefined,
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  useUTC: true,

  synchronize: false,
  poolSize: ConstantsEnv.database.pool.max,
  extra: {
    connectionTimeoutMillis: ConstantsEnv.database.pool.acquire,
    idleTimeoutMillis: ConstantsEnv.database.pool.idle,
  },

  poolErrorHandler: (err: Error) =>
    LoggerManager.log('database', {
      message: err.message,
      err,
    }),
});
