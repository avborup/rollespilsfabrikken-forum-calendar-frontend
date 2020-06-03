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
};
