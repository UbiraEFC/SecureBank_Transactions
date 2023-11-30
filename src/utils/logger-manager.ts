/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import stringify from 'json-stringify-safe';

const logReplacer = (key, data) => {
  if (typeof data === 'string' && data.length > 3000) {
    data = data.slice(0, 3000);
  }

  return data;
};

const LoggerManager = {
  log: (action: string, data: any): void => {
    // eslint-disable-next-line no-console
    console.log(`${action}`, stringify(data, logReplacer));
  },

  databaseLogger: {
    logMigration: (data: any) => {
      if (process.env.DEBUG === 'true') {
        LoggerManager.log('application-log', { type: 'database', data });
      }
    },
    logQuery: (data: any, params: any) => {
      if (process.env.DEBUG === 'true') {
        LoggerManager.log('application-log', { type: 'database', data, params });
      }
    },
    logQueryError: (data: any) => {
      if (process.env.DEBUG === 'true') {
        LoggerManager.log('application-log', { type: 'database', data });
      }
    },
    logQuerySlow: (data: any) => {
      if (process.env.DEBUG === 'true') {
        LoggerManager.log('application-log', { type: 'database', data });
      }
    },
    logSchemaBuild: (data: any) => {
      if (process.env.DEBUG === 'true') {
        LoggerManager.log('application-log', { type: 'database', data });
      }
    },
    log: (data: any) => {
      if (process.env.DEBUG === 'true') {
        LoggerManager.log('application-log', { type: 'database', data });
      }
    },
  },
};

export default LoggerManager;
