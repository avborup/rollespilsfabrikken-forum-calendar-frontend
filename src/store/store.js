import Vue from 'vue';
import Vuex from 'vuex';
import forumModule from './forum/forumModule';
import calendarModule from './calendar/calendarModule';
import authModule from './auth/authModule';
import state from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    forum: {
      namespaced: true,
      ...forumModule,
    },
    calendar: {
      namespaced: true,
      ...calendarModule,
    },
    auth: {
      namespaced: true,
      ...authModule,
    },
  },
  state,
  getters,
  actions,
  mutations,
});
