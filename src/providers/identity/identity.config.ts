import ConstantsEnv from '@src/config/env/constants';
import Dictionary from '@src/config/typing/dictionary';

export function setIdentityConfig(env: Dictionary<string>): void {
  ConstantsEnv.identityProvider = {
    keycloak: {
      realm: env.KEYCLOAK_REALM,
      url: env.KEYCLOAK_URL,
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      jwtPublicKey: env.KEYCLOAK_JWT_PUBLIC_KEY,
    },
  };
}
