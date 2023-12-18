import ConstantsEnv from '@src/config/env/constants';

import { createAppInstance } from './app';
import { logInit } from './utils/logs';

export async function bootstrap(): Promise<void> {
  const app = await createAppInstance();

  app.listen(ConstantsEnv.port, (): void => {
    logInit(`Server running at http://localhost:${ConstantsEnv.port}`);
    logInit(`Environment: ${ConstantsEnv.env}`);
  });
}
