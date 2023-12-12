import axios from 'axios';

import ConstantsEnv from '@src/config/env/constants';
import { logError } from '@src/utils/logs';

interface KeycloakRealmResponse {
  realm: string;
  public_key: string;
}

interface GetPublicKeyResponse {
  publicKey: string;
}

export async function getKeycloakPublicKey(): Promise<GetPublicKeyResponse> {
  const { url, realm } = ConstantsEnv.identityProvider.keycloak;
  try {
    const { data } = await axios.get<KeycloakRealmResponse>(`${url}/auth/realms/${realm}`);
    let { public_key: publicKey } = data;
    publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    return {
      publicKey,
    };
  } catch (err) {
    logError('Failed to get public key from Keycloak', err);
    throw new Error(`Failed to get public key from Keycloak: ${err.message}`);
  }
}
