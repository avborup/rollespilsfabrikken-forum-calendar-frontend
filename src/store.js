/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';
import { dateRangesOverlap } from '@/dateUtils';
import { testEvents, testCategories } from '@/testData';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    calendarEvents: testEvents,
    calendarCategories: testCategories,
    currentlyFocusedEventId: testEvents[0].id, // FIXME: Better way in the end product
  },
  mutations: {
    SET_CURRENTLY_FOCUSED_EVENT_ID(state, newEventId) {
      state.currentlyFocusedEventId = newEventId;
    },
  },
  actions: {
    updateCurrentlyFocusedEventId(context, eventId) {
      context.commit('SET_CURRENTLY_FOCUSED_EVENT_ID', eventId);
    },
  },
  getters: {
    // FIXME: Should this be done server side instead?
    getEventsOnDate: state => (date) => {
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
    getCurrentlyFocusedEvent(state) {
      const id = state.currentlyFocusedEventId;
      return state.calendarEvents.find(event => event.id === id);
    },

    // FIXME: Handle the case of this finding no match.
    // Currently, it is no problem, because the background colour defaults to
    // the CSS-defined one, but it might become one.
    getCategoryColour: state => name => state
      .calendarCategories
      .find(category => category.name === name)
      .colour,

    getAllCategories(state) {
      return state.calendarCategories.map(({ name }) => name);
    },
  },
});
