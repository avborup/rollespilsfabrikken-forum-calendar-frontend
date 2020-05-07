import * as auth from '@/api/auth';

export default {
  async updateAuthStatus(context) {
    const { authToken } = context.state;
    const isAuthenticated = authToken === null
      ? false
      : await auth.tokenIsValid(authToken);

    context.commit('SET_AUTH_STATUS', isAuthenticated);
  },

  async login(context, { email, password }) {
    const authToken = await auth.login(email, password);

    context.commit('SET_AUTH_TOKEN', authToken);
    context.dispatch('updateAuthStatus');
  },
};
