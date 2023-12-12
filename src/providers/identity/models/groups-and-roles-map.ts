export type ApiRoles = 'admin' | 'user';

export type GroupsRoles = 'admin' | 'user';

export const GroupRolesArray = ['admin', 'user'];

export const GroupsRolesPermissions: Map<GroupsRoles, ApiRoles[]> = new Map<GroupsRoles, ApiRoles[]>([
  ['admin', ['admin']],
  ['user', ['user']],
]);
