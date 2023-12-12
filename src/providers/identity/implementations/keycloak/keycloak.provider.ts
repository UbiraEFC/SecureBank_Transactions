import { AxiosInstance, AxiosResponse } from 'axios';
import { injectable } from 'inversify';
import ClientRepresentation from 'keycloak-admin/lib/defs/clientRepresentation';
import GroupRepresentation from 'keycloak-admin/lib/defs/groupRepresentation';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import RoleRepresentation, { RoleMappingPayload } from 'keycloak-admin/lib/defs/roleRepresentation';
import querystring from 'querystring';

import ContantsEnv from '@src/config/env/constants';
import Dictionary from '@src/config/typing/dictionary';
import IntegrationError from '@src/utils/errors/integration';
import LoggerManager from '@src/utils/logger-manager';
import { logInfo, logWarn } from '@src/utils/logs';
import { validResourceIdRegex } from '@src/utils/regex';

import { IdentityAuthToken, IIdentityProvider } from '../../interface/identity.interface';
import { KeycloakServiceAccount } from './keycloak.domain';
import { KeycloakInstance } from './keycloak.instance';

@injectable()
class KeycloakProvider implements IIdentityProvider {
  private keycloak: KeycloakInstance;
  private sessionToken: IdentityAuthToken;

  constructor() {
    this.keycloak = new KeycloakInstance({
      baseUrl: ContantsEnv.identityProvider.keycloak.url,
    });
  }

  //
  //--------------------------------------------------------------------------
  // Internal methods
  //--------------------------------------------------------------------------
  //
  private getGroupIdFromHeader(response: AxiosResponse): string {
    const groupId = `${response.headers.Location}`.match(validResourceIdRegex)[1];

    return groupId;
  }

  private getUserIdFromHeader(response: AxiosResponse): string {
    const userId = `${response.headers.location}`.match(validResourceIdRegex)[1];

    return userId;
  }

  //
  //--------------------------------------------------------------------------
  // Realm authentication
  //--------------------------------------------------------------------------
  //

  private setSessionToken(sessionToken: IdentityAuthToken): void {
    this.sessionToken = sessionToken;
  }

  private getAuthenticatedInstance(): AxiosInstance {
    return this.keycloak.withAccessToken(this.sessionToken.access_token).getInstance();
  }

  public async auth(): Promise<IdentityAuthToken> {
    const { clientId, clientSecret, realm } = ContantsEnv.identityProvider.keycloak;

    if (process.env.NODE_ENV === 'keycloak-setup') {
      return this.authAdminCli(clientId, clientSecret, realm);
    }
    return this.authClientId(clientId, clientSecret, realm);
  }

  private async authAdminCli(username: string, password: string, realm: string): Promise<IdentityAuthToken> {
    let response: IdentityAuthToken;

    const instance = this.keycloak.withContentType('application/x-www-form-urlencoded').getInstance();

    try {
      // const { useAuthWithServiceAccount } = ContantsEnv.identityProvider.keycloak;

      // if (useAuthWithServiceAccount) {
      realm = 'master';
      // }

      const { data } = await instance.post<IdentityAuthToken>(
        `/auth/realms/${realm}/protocol/openid-connect/token`,
        querystring.stringify({
          client_id: 'admin-cli',
          username,
          password,
          grant_type: 'password',
        }),
      );

      this.setSessionToken(data);

      this.keycloak.resetContentType();

      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.auth',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para autenticar na admin-cli com o username ${username}: ${error.message}`,
        client: {
          id: username,
        },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    return response;
  }

  private async authClientId(clientId: string, clientSecret: string, realm: string): Promise<IdentityAuthToken> {
    let response: IdentityAuthToken;

    const instance = this.keycloak.withContentType('application/x-www-form-urlencoded').getInstance();

    try {
      // const { useAuthWithServiceAccount } = ContantsEnv.identityProvider.keycloak;

      // if (useAuthWithServiceAccount) {
      //   realm = 'master';
      // }

      const { data } = await instance.post<IdentityAuthToken>(
        `/auth/realms/${realm}/protocol/openid-connect/token`,
        querystring.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
      );

      this.setSessionToken(data);

      this.keycloak.resetContentType();

      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.auth',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para autenticar com clienteId ${clientId}: ${error.message}`,
        client: {
          id: clientId,
        },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    return response;
  }

  //
  //--------------------------------------------------------------------------
  // Realm management
  //--------------------------------------------------------------------------
  //

  public async getRealm(realmName: string): Promise<RealmRepresentation> {
    let response: RealmRepresentation;
    logInfo('keycloak', `Buscando realm ${realmName}...`);

    try {
      const instance = this.getAuthenticatedInstance();

      const { data } = await instance.get<RealmRepresentation[]>('/auth/admin/realms');

      response = data.find((o) => o.realm === realmName);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getRealm',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para buscar o realm ${realmName}: ${error.message}`,
        realm: {
          name: realmName,
        },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    if (!response) {
      logWarn('keycloak', `Realm ${realmName} não encontrado...`);
    } else {
      logInfo('keycloak', `Realm ${realmName} encontrado...`);
    }

    return response;
  }

  public async addRealm(name: string): Promise<void> {
    logInfo('keycloak', `Criando realm ${name}...`);

    const realmExist = await this.getRealm(name);

    if (realmExist) {
      logInfo('keycloak', `Realm ${name} já existe, retornando...`);
      return;
    }

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.post('/auth/admin/realms', {
        id: name,
        realm: name,
        enabled: true,
        loginWithEmailAllowed: true,
        duplicateEmailsAllowed: false,
        resetPasswordAllowed: false,
        editUsernameAllowed: true,
        bruteForceProtected: true,
        permanentLockout: false,
        maxFailureWaitSeconds: 900,
        minimumQuickLoginWaitSeconds: 60,
        waitIncrementSeconds: 60,
        quickLoginCheckMilliSeconds: 1000,
        maxDeltaTimeSeconds: 43200,
        failureFactor: 5,
      });

      logInfo('keycloak', `Realm ${name} criado com sucesso...`);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addRealm',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para adicionar o realm ${name}: ${error.message}`,
        realm: { name },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }
  }

  //
  //--------------------------------------------------------------------------
  // Role management
  //--------------------------------------------------------------------------
  //

  public async getAllRoles(realm: string): Promise<RoleRepresentation[]> {
    logInfo('keycloak', `Buscando todas as roles no realm ${realm}...`);

    let response: RoleRepresentation[];
    const instance = this.getAuthenticatedInstance();

    try {
      const { data } = await instance.get<RoleRepresentation[]>(`/auth/admin/realms/${realm}/roles`);
      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getAllRoles',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para buscar as roles do realm ${realm}: ${error.message}`,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    if (!response.length) {
      logWarn('keycloak', `Roles não encontradas no realm ${realm}...`);
    } else {
      logInfo('keycloak', `${response.length} Roles encontradas no realm ${realm}...`);
    }

    return response;
  }

  public async getRole(roleName: string, realm: string): Promise<RoleRepresentation> {
    logInfo('keycloak', `Buscando role ${roleName} no realm ${realm}...`);

    let response: RoleRepresentation;

    try {
      const roles = await this.getAllRoles(realm);
      response = roles?.find((o) => o.name === roleName);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getRole',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para buscar a role ${roleName} do realm ${realm}: ${error.message}`,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    if (response) {
      logInfo('keycloak', `Role ${roleName} encontrada no realm ${realm}...`);
    } else {
      logInfo('keycloak', `Role ${roleName} não encontrada no realm ${realm}...`);
    }

    return response;
  }

  public async addRole(roleName: string, realm: string): Promise<RoleRepresentation> {
    const roleExist = await this.getRole(roleName, realm);

    if (roleExist) {
      logInfo('keycloak', `Role ${roleName} já existe no realm ${realm}, retornando...`);
      return roleExist;
    }

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.post(`/auth/admin/realms/${realm}/roles`, {
        name: roleName,
      });
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addRole',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para adicionar a role ${roleName} no realm ${realm}: ${error.message}`,
        realm: { name: realm },
        role: { name: roleName },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    const response = await this.getRole(roleName, realm);
    return response;
  }

  //
  //--------------------------------------------------------------------------
  // Clients management
  //--------------------------------------------------------------------------
  //

  public async getClient(clientId: string, realm: string): Promise<ClientRepresentation> {
    logInfo('keycloak', `Buscando cliente ${clientId} no realm ${realm}...`);

    let response: ClientRepresentation;
    const instance = this.getAuthenticatedInstance();

    try {
      const { data } = await instance.get<ClientRepresentation[]>(`/auth/admin/realms/${realm}/clients`);

      response = data?.find((o) => o.clientId === clientId);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getClient',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak para buscar o clienteId ${clientId} no realm ${realm}: ${error.message}`,
        client: {
          id: clientId,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    if (response) {
      logInfo('keycloak', `Cliente ${clientId} encontrado no realm ${realm}...`);
    } else {
      logInfo('keycloak', `Cliente ${clientId} não encontrado no realm ${realm}...`);
    }

    return response;
  }

  public async addFrontendClient(clientName: string, realm: string): Promise<void> {
    logInfo('keycloak', `Criando cliente de frontend ${clientName} no realm ${realm}...`);

    const clientExist = await this.getClient(clientName, realm);

    if (clientExist) {
      logInfo('keycloak', `Cliente ${clientName} já existe no realm ${realm}, retornando...`);
      return;
    }

    const instance = this.getAuthenticatedInstance();

    const protocolMappersConfig = {
      'userinfo.token.claim': 'true',
      'id.token.claim': 'true',
      'access.token.claim': 'true',
      'jsonType.label': 'String',
    };

    try {
      await instance.post(`/auth/admin/realms/${realm}/clients`, {
        attributes: {},
        clientId: clientName,
        name: clientName,
        surrogateAuthRequired: false,
        enabled: true,
        clientAuthenticatorType: 'client-secret',
        redirectUris: ['*'],
        webOrigins: ['*'],
        notBefore: 0,
        bearerOnly: false,
        consentRequired: false,
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: false,
        publicClient: true,
        protocol: 'openid-connect',
        fullScopeAllowed: true,
        protocolMappers: [
          {
            protocol: 'openid-connect',
            protocolMapper: 'oidc-usermodel-property-mapper',
            name: 'UserId',
            config: {
              ...protocolMappersConfig,
              'user.attribute': 'id',
              'claim.name': 'userId',
            },
          },
          {
            protocol: 'openid-connect',
            protocolMapper: 'oidc-usermodel-attribute-mapper',
            name: 'CompanyId',
            config: {
              ...protocolMappersConfig,
              'user.attribute': 'companyId',
              'claim.name': 'companyId',
            },
          },
        ],
      });
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addFrontendClient',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak criar o client ${clientName} no realm ${realm}: ${error.message}`,
        client: {
          name: clientName,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `Cliente de frontend ${clientName} criada com sucesso...`);
  }

  public async addBackendClient(clientName: string, realm: string): Promise<void> {
    logInfo('keycloak', `Criando cliente de backend ${clientName} no realm ${realm}...`);

    const clientExist = await this.getClient(clientName, realm);

    if (clientExist) {
      logInfo('keycloak', `Cliente ${clientName} já existe no realm ${realm}, retornando...`);
      return;
    }

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.post(`/auth/admin/realms/${realm}/clients`, {
        enabled: true,
        attributes: {},
        redirectUris: [],
        clientId: clientName,
        name: clientName,
        surrogateAuthRequired: false,
        clientAuthenticatorType: 'client-secret',
        webOrigins: [],
        notBefore: 0,
        bearerOnly: false,
        consentRequired: false,
        standardFlowEnabled: false,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: true,
        publicClient: false,
        frontchannelLogout: false,
        protocol: 'openid-connect',
        fullScopeAllowed: true,
      });
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addBackendClient',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak criar o client ${clientName} no realm ${realm}: ${error.message}`,
        client: {
          name: clientName,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `Cliente de backend ${clientName} criada com sucesso no realm ${realm}...`);
  }

  // Service account
  private async getClientServiceAccount(clientId: string, realm: string): Promise<KeycloakServiceAccount> {
    logInfo('keycloak', 'Buscando client service account...');

    let response: KeycloakServiceAccount;
    const instance = this.getAuthenticatedInstance();

    try {
      const { data } = await instance.get<KeycloakServiceAccount>(
        `/auth/admin/realms/${realm}/clients/${clientId}/service-account-user`,
      );
      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getClientServiceAccount',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak criar a conta de serviço para o client ${clientId} no realm ${realm}: ${error.message}`,
        client: {
          id: clientId,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    if (!response) {
      logWarn('keycloak', `Cliente service account ${response.id}/${response.username} não encontrado...`);
    } else {
      logInfo('keycloak', `Cliente service account ${response.id}/${response.username} encontrado...`);
    }

    return response;
  }

  private async addRolesToClientServiceAccount(
    userId: string,
    clientId: string,
    rolesAssociate: RoleRepresentation[],
    realm: string,
  ): Promise<void> {
    logInfo('keycloak', `Associando roles ao cliente ${clientId}...`);

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.post(
        `/auth/admin/realms/${realm}/users/${userId}/role-mappings/clients/${clientId}`,
        rolesAssociate,
      );
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addRolesToClientServiceAccount',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao adicionar roles a conta de serviço no realm ${realm}: ${error.message}`,
        user: { id: userId },
        client: { clientId },
        rolesAssociate,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `Roles associadas ao cliente ${clientId}...`);
  }

  private async getAvailableRolesToAssociateToClient(
    userId: string,
    clientId: string,
    realm: string,
  ): Promise<RoleRepresentation[]> {
    logInfo('keycloak', 'Buscando roles disponíveis do client service account...');

    let response: RoleRepresentation[];
    const instance = this.getAuthenticatedInstance();

    try {
      const { data } = await instance.get<RoleRepresentation[]>(
        `/auth/admin/realms/${realm}/users/${userId}/role-mappings/clients/${clientId}/available`,
      );

      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getAvailableRolesToAssociateToClient',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar obter roles disponíveis do realm ${realm}: ${error.message}`,
        user: { id: userId },
        client: { clientId },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    return response;
  }

  public async addRolesToClient(clientId: string, realm: string): Promise<void> {
    const permitted = ['view-users', 'query-users', 'query-groups', 'manage-users'];

    // Get clients
    const clientRealmManagement = await this.getClient('realm-management', realm);
    const clientBackendMobile = await this.getClient(clientId, realm);

    // Get SVC accounts and available roles
    const serviceAccount = await this.getClientServiceAccount(clientBackendMobile.id, realm);
    const rolesAvailable = await this.getAvailableRolesToAssociateToClient(
      serviceAccount.id,
      clientRealmManagement.id,
      realm,
    );

    if (rolesAvailable.length) {
      const rolesToAdd: RoleRepresentation[] = rolesAvailable
        .filter((role) => permitted.find((o) => o === role.name))
        .map((role) => {
          return {
            id: role.id,
            name: role.name,
          };
        });

      await this.addRolesToClientServiceAccount(serviceAccount.id, clientRealmManagement.id, rolesToAdd, realm);
    }
  }

  //
  //--------------------------------------------------------------------------
  // Group management
  //--------------------------------------------------------------------------
  //

  public async getAllGroups(realm: string): Promise<GroupRepresentation[]> {
    logInfo('keycloak', `Buscando grupos do realm ${realm}...`);

    let response: GroupRepresentation[];
    const instance = this.getAuthenticatedInstance();

    try {
      const { data } = await instance.get<GroupRepresentation[]>(`/auth/admin/realms/${realm}/groups`);
      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.getAllGroups',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar obter grupos do realm ${realm}: ${error.message}`,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    if (!response.length) {
      logWarn('keycloak', `Grupos não encontrados no realm ${realm}...`);
    } else {
      logInfo('keycloak', `${response.length} Grupos encontrados no realm ${realm}...`);
    }

    return response;
  }

  public async getGroupByName(name: string, realm: string): Promise<GroupRepresentation> {
    const groups = await this.getAllGroups(realm);

    const group = groups?.find((g) => g.name === name);

    return group;
  }

  public async getGroupById(id: string, realm: string): Promise<GroupRepresentation> {
    const groups = await this.getAllGroups(realm);

    const group = groups?.find((g) => g.id === id);

    return group;
  }

  public async addGroup(
    group: {
      name: string;
      roles: RoleRepresentation[];
      attributes?: Dictionary<string>;
    },
    realm: string,
  ): Promise<GroupRepresentation> {
    const groupExist = await this.getGroupByName(group.name, realm);

    if (groupExist) {
      logInfo('keycloak', `Grupo ${group.name} já existe no realm ${realm}, retornando...`);
      return groupExist;
    }

    const instance = this.getAuthenticatedInstance();

    try {
      const apiResponse = await instance.post(`/auth/admin/realms/${realm}/groups`, {
        name: group.name,
        ...(group.attributes && {
          attributes: {
            ...(group.attributes.companyId && { companyId: [group.attributes.companyId] }),
          },
        }),
      });

      const groupId = this.getGroupIdFromHeader(apiResponse);

      await this.addRolesOnGroup(groupId, group.roles as RoleMappingPayload[], realm);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addGroup',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar obter grupos do realm ${realm}: ${error.message}`,
        group,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    const response = await this.getGroupByName(group.name, realm);
    return response;
  }

  public async addChildGroup(
    childGroupName: string,
    parentGroupId: string,
    realm: string,
  ): Promise<GroupRepresentation> {
    logInfo('keycloak', `Setando grupo ${childGroupName} como filho do grupo ${parentGroupId}...`);

    let response: GroupRepresentation;
    const instance = this.getAuthenticatedInstance();

    try {
      const { data } = await instance.post<GroupRepresentation>(
        `/auth/admin/realms/${realm}/groups/${parentGroupId}/children`,
        {
          name: childGroupName,
        },
      );
      response = data;
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addChildGroup',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar um grupo filho do realm ${realm}: ${error.message}`,
        group: {
          childGroupName,
          parentGroupId,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `Setado grupo ${childGroupName} como filho do grupo ${parentGroupId}...`);

    return response;
  }

  public async addRolesOnGroup(
    groupId: string,
    roles: RoleMappingPayload[],
    realm: string,
  ): Promise<GroupRepresentation> {
    logInfo('keycloak', `Setando ${roles.length} roles no grupo ${groupId}...`);

    let response: GroupRepresentation;
    const instance = this.getAuthenticatedInstance();

    try {
      await instance.post(`/auth/admin/realms/${realm}/groups/${groupId}/role-mappings/realm`, roles);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addRolesOnGroup',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar uma role a um grupo no realm ${realm}: ${error.message}`,
        group: {
          id: groupId,
          roles,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `${roles.length} roles associadas ao grupo ${groupId}...`);

    return response;
  }

  //
  //--------------------------------------------------------------------------
  // Company management
  //--------------------------------------------------------------------------
  //

  public async addCompany(company: { id: string }, realm: string): Promise<string> {
    await this.auth();

    logInfo('keycloak', `Criando grupo (composite) com id [company.${company.id}]...`);

    const groupExist = await this.getGroupByName(`company.${company.id}`, realm);

    if (groupExist) {
      logInfo('keycloak', `Grupo (composite) com id [company.${company.id}] já existe, retornando...`);
      return groupExist.id;
    }

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.post(`/auth/admin/realms/${realm}/groups`, {
        name: `company.${company.id}`,
        attributes: {
          companyId: [`${company.id}`],
        },
      });
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addCompany',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar uma company no realm ${realm}: ${error.message}`,
        company,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    const { id } = await this.getGroupByName(`company.${company.id}`, realm);

    return id;
  }

  public async addCompanyGroup(
    group: { name: string; parentId: string; roles: string[] },
    realm: string,
  ): Promise<GroupRepresentation> {
    let response: GroupRepresentation;

    await this.auth();

    const roles = await this.getAllRoles(realm);

    try {
      this.keycloak.resetContentType();
      const rolesToAdd = roles.filter((role) => group.roles.includes(role.name));
      response = await this.addChildGroup(group.name, group.parentId, realm);
      await this.addRolesOnGroup(response.id, rolesToAdd as RoleMappingPayload[], realm);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addCompanyGroup',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar um grupo em uma company no realm ${realm}: ${error.message}`,
        group,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    return response;
  }

  //
  //--------------------------------------------------------------------------
  // User management
  //--------------------------------------------------------------------------
  //

  public async addAdmin(user: { email: string; password: string }, realm: string): Promise<{ id: string }> {
    let userId: string;

    await this.auth();

    logInfo('keycloak', `Criando usuário ${user.email} no realm ${realm}...`);

    const instance = this.getAuthenticatedInstance();

    try {
      const response = await instance.post(`/auth/admin/realms/${realm}/users`, {
        username: user.email,
        email: user.email,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: user.password,
            temporary: false,
          },
        ],
        groups: ['backoffice', 'app'],
      });

      userId = this.getUserIdFromHeader(response);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addAdmin',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar um admin no realm ${realm}: ${error.message}`,
        user: {
          email: user.email,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    return {
      id: userId,
    };
  }

  public async addUser(
    user: { password: string; email: string; username?: string; groups?: string[] },
    realm: string,
  ): Promise<{ id: string }> {
    let userId: string;

    await this.auth();

    logInfo('keycloak', `Criando usuário ${user.email} no realm ${realm}...`);

    const instance = this.getAuthenticatedInstance();

    try {
      const userToSave = {
        username: user.username || user.email,
        email: user.email,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: user.password,
            temporary: false,
          },
        ],
        groups: user.groups || [],
      };

      const response = await instance.post(`/auth/admin/realms/${realm}/users`, userToSave);

      userId = this.getUserIdFromHeader(response);
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addUser',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar um usuário no realm ${realm}: ${error.message}`,
        user: {
          email: user.email,
        },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    return {
      id: userId,
    };
  }

  public async addUserGroup(userGroup: { userId: string; groupId: string }, realm: string): Promise<void> {
    await this.auth();

    try {
      logInfo('keycloak', `Associando grupo ${userGroup.groupId} usuário ${userGroup.userId} para o realm ${realm}...`);

      const instance = this.getAuthenticatedInstance();
      await instance.put(`/auth/admin/realms/${realm}/users/${userGroup.userId}/groups/${userGroup.groupId}`);

      logInfo(
        'keycloak',
        `Grupo ${userGroup.groupId} associado ao usuário ${userGroup.userId} para o realm ${realm}...`,
      );
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.addUserGroup',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar adicionar um usuário no realm ${realm}: ${error.message}`,
        user: { id: userGroup.userId },
        group: { id: userGroup.groupId },
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }
  }

  public async updateUser(user: { id: string; email: string; username: string }, realm: string): Promise<void> {
    await this.auth();

    logInfo('keycloak', `Atualizando o usuário ${user.email} no realm ${realm}...`);

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.put(`/auth/admin/realms/${realm}/users/${user.id}`, {
        ...(user.username && { username: user.username }),
        ...(user.email && { email: user.email }),
      });
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.updateUser',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar atualizar um usuário no realm ${realm}: ${error.message}`,
        user,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `Usuário atualizado ${user.email} no realm ${realm}...`);
  }

  public async updatePassword(user: { id: string; password: string }, realm: string): Promise<void> {
    await this.auth();

    logInfo('keycloak', `Atualizando a senha do usuário ${user.id} no realm ${realm}...`);

    const instance = this.getAuthenticatedInstance();

    try {
      await instance.put(`/auth/admin/realms/${realm}/users/${user.id}/reset-password`, {
        type: 'password',
        value: user.password,
        temporary: false,
      });
    } catch (error) {
      LoggerManager.log('keycloak-integration', {
        origin: 'keycloak.updateUser',
        type: 'error',
        error: error as Error,
        message: `Houve um erro no keycloak ao tentar atualizar a senha do usuário no realm ${realm}: ${error.message}`,
        user,
        realm: { name: realm },
      });

      throw new IntegrationError('identity-server/keycloak', error);
    }

    logInfo('keycloak', `Usuário ${user.id} atualizado no realm ${realm}...`);
  }

  public async deleteUser(userId: string, realm: string): Promise<void> {
    await this.auth();

    logInfo('keycloak', `Deletando o usuário ${userId} no realm ${realm}...`);

    await this.getAuthenticatedInstance()
      .delete(`/auth/admin/realms/${realm}/users/${userId}`)
      .catch((error) => {
        LoggerManager.log('keycloak-integration', {
          origin: 'keycloak.deleteUser',
          type: 'error',
          error: error as Error,
          message: `Houve um erro no keycloak ao tentar deletar o usuário no realm ${realm}: ${error.message}`,
          user: { id: userId },
          realm: { name: realm },
        });

        throw new IntegrationError('identity-server/keycloak', error);
      });

    logInfo('keycloak', `Usuário deletado ${userId} no realm ${realm}...`);
  }
}

export default KeycloakProvider;
