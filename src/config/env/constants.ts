import { IConstants } from '@src/config/env/constants.inteface';

import { env } from '.';

const ContantsEnv: IConstants = {
  env: env.NODE_ENV,
  port: env.API_PORT,
  appName: env.APP_NAME,
  debug: env.DEBUG,
};

export default ContantsEnv;
