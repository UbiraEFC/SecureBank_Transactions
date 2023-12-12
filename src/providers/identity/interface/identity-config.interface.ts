export interface IIdentityProviderConfig {
  keycloak?: {
    realm: string;
    url: string;
    clientId: string;
    clientSecret: string;
    jwtPublicKey: string;
  };
}
