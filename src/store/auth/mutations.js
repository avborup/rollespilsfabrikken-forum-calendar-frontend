/* eslint-disable no-param-reassign */
import initialState from './state';

export default {
  SET_AUTH_STATUS(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },

  SET_AUTH_TOKEN(state, authToken) {
    state.authToken = authToken;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState());
  },
};
