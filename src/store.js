import Vue from 'vue';
import Vuex from 'vuex';
import { dateRangesOverlap } from '@/dateUtils';
import { testEvents } from '@/testData';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    calendarEvents: testEvents,
  },
  mutations: {

  },
  actions: {

  },
  getters: {
    // FIXME: Should this be done server side instead?
    eventsOnDate: state => (date) => {
      const dayDate = [date.getFullYear(), date.getMonth(), date.getDate()];
      const dayStart = new Date(...dayDate);
      const dayEnd = new Date(...dayDate, 23, 59);

      return state.calendarEvents.filter(event => dateRangesOverlap(
        dayStart,
        dayEnd,
        event.timeframe.start,
        event.timeframe.end,
      ));
    },
  },
});
