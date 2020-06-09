import * as api from '@/api/api';
import * as auth from '@/api/auth';

export default {
  async fetchUser(context) {
    const { authToken } = context.rootState.auth;
    const user = await api.getUser(authToken);

    context.commit('SET_USER', user);
  },

  async fetchAllUsers(context) {
    const { authToken } = context.rootState.auth;
    const allUsers = await api.getAllUsers(authToken);

    context.commit('SET_USERS', allUsers);
  },

  async fetchAllRoles(context) {
    const { authToken } = context.rootState.auth;
    const roles = await auth.getAllRoles(authToken);

    context.commit('SET_ROLES', roles);
  },

  async addRole(context, { roleId, userId }) {
    const { authToken } = context.rootState.auth;
    await auth.modifyRoleOnUser(authToken, { roleId, userId }, 'add');
  },

  async removeRole(context, { roleId, userId }) {
    const { authToken } = context.rootState.auth;
    await auth.modifyRoleOnUser(authToken, { roleId, userId }, 'delete');
  },

  async createRole(context, { colour, roleName }) {
    const { authToken } = context.rootState.auth;
    await auth.createRole(authToken, roleName, colour);
  },

  async deleteRole(context, roleId) {
    const { authToken } = context.rootState.auth;
    await auth.deleteRole(authToken, roleId);
  },

  async fetchAllPermissions(context) {
    const { authToken } = context.rootState.auth;
    const perms = await auth.getAllPermissions(authToken);

    context.commit('SET_PERMISSIONS', perms);
  },

  async addPermissionsToRole(context, { roleId, permissionIds }) {
    const { authToken } = context.rootState.auth;
    await auth.modifyRolePermissions(authToken, roleId, permissionIds, 'add');
  },

  async removePermissionsFromRole(context, { roleId, permissionIds }) {
    const { authToken } = context.rootState.auth;
    await auth.modifyRolePermissions(authToken, roleId, permissionIds, 'delete');
  },

  setEditRoleDetails(context, details) {
    context.commit('SET_EDIT_ROLE_DETAILS', details);
  },

  async editRole(context, { roleId, colour, roleName }) {
    const { authToken } = context.rootState.auth;
    await auth.editRole(authToken, roleId, roleName, colour);
  },

  async deleteForumOrCalendar(context, { id, type }) {
    const { authToken } = context.rootState.auth;
    await api.deleteForumOrCalendar(authToken, id, type);
  },

  setEditForumCalendarDetails(context, details) {
    context.commit('SET_FORUM_CALENDAR_EDIT_DETAILS', details);
  },

  async editForumOrCalendar(context, {
    id,
    name,
    desc,
    colour,
    type,
  }) {
    const { authToken } = context.rootState.auth;
    await api.editForumOrCalendar(authToken, id, name, desc, colour, type);
  },

  async createForumOrCalendar(context, {
    name,
    desc,
    colour,
    type,
  }) {
    const { authToken } = context.rootState.auth;
    await api.createForumOrCalendar(authToken, name, desc, colour, type);
  },
};
