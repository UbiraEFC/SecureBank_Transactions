import ClientRepresentation from 'keycloak-admin/lib/defs/clientRepresentation';
import GroupRepresentation from 'keycloak-admin/lib/defs/groupRepresentation';
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';

import Dictionary from '@src/config/typing/dictionary';

export interface IdentityAuthToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
}

export interface IIdentityProvider {
  // Auth
  auth(): Promise<IdentityAuthToken>;

  // Realm
  addRealm(name: string): Promise<void>;

  // Role
  getRole(roleName: string, realm: string): Promise<RoleRepresentation>;
  addRole(roleName: string, realm: string): Promise<RoleRepresentation>;

  // Client
  getClient(clientId: string, realm: string): Promise<ClientRepresentation>;
  addFrontendClient(clientName: string, realm: string): Promise<void>;
  addBackendClient(clientName: string, realm: string): Promise<void>;
  addRolesToClient(clientId: string, realm: string): Promise<void>;

  // Group
  getAllGroups(realm: string): Promise<GroupRepresentation[]>;
  getGroupByName(name: string, realm: string): Promise<GroupRepresentation>;
  addGroup(
    group: {
      name: string;
      roles: RoleRepresentation[];
      attributes?: Dictionary<string>;
    },
    realm: string,
  ): Promise<GroupRepresentation>;
  addChildGroup(childGroupName: string, parentGroupId: string, realm: string): Promise<GroupRepresentation>;

  // Company
  addCompany(company: { id: string }, realm: string): Promise<string>;
  addCompanyGroup(
    group: { name: string; parentId: string; roles: string[] },
    realm: string,
  ): Promise<GroupRepresentation>;

  // User
  addAdmin(user: { email: string; password: string }, realm: string): Promise<{ id: string }>;
  addUser(user: { password: string; email: string; username?: string }, realm: string): Promise<{ id: string }>;
  addUserGroup(userGroup: { userId: string; groupId: string }, realm: string): Promise<void>;
  updateUser(user: { id: string; email?: string; username?: string }, realm: string): Promise<void>;
  updatePassword(user: { id: string; password: string }, realm: string): Promise<void>;
  deleteUser(userId: string, realm: string): Promise<void>;
}
