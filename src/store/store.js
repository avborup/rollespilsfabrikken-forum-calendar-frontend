import Vue from 'vue';
import Vuex from 'vuex';
import forumModule from './forum/forumModule';
import calendarModule from './calendar/calendarModule';

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
  },
});
