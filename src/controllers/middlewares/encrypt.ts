import crypto from 'crypto';

import ConstantsEnv from '@src/config/env/constants';

export function encrypt(data: string): string {
  const encryptedData = crypto.publicEncrypt(
    {
      key: ConstantsEnv.frontendPublicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(data),
  );

  return encryptedData.toString('base64');
}
