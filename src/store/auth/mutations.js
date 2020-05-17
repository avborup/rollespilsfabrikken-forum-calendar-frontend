/* eslint-disable no-param-reassign */

export default {
  SET_AUTH_STATUS(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },

  SET_AUTH_TOKEN(state, authToken) {
    state.authToken = authToken;
  },
};
