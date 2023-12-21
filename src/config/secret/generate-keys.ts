import * as crypto from 'crypto';

import ConstantsEnv from '@src/config/env/constants';

export function generateBackendKeys(): void {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  ConstantsEnv.backendPublicKey = publicKey;
  ConstantsEnv.backendPrivateKey = privateKey;
}

// TODO: Apply this method on the frontend
export function generateFrontendKeys(): void {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  ConstantsEnv.frontendPublicKey = publicKey;
  ConstantsEnv.frontendPrivateKey = privateKey;
}
