/* eslint-disable no-param-reassign */

export default {
  SET_USER(state, user) {
    state.user = user;
  },

  SET_USERS(state, allUsers) {
    state.allUsers = allUsers;
  },

  SET_ROLES(state, roles) {
    state.allRoles = roles;
  },
};
