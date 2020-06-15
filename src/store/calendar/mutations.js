/* eslint-disable no-param-reassign */
import initialState from './state';

export default {
  SET_CURRENTLY_FOCUSED_EVENT_ID(state, newEventId) {
    state.currentlyFocusedEventId = newEventId;
  },

  SET_CURRENTLY_SHOWN_CALENDARS(state, newCalendars) {
    state.currentlyShownCalendars = newCalendars;
  },

  SET_CALENDARS(state, calendars) {
    state.allCalendars = calendars;
  },

  REGISTER_LOADED_MONTHS(state, months) {
    const obj = months.reduce((acc, month) => ({
      ...acc,
      [month]: true,
    }), {});

    state.loadedMonths = {
      ...state.loadedMonths,
      ...obj,
    };
  },

  RESET_LOADED_EVENTS(state) {
    state.allEvents = [];
    state.loadedMonths = {};
  },

  ADD_EVENTS(state, events) {
    state.allEvents.push(...events);
  },

  SET_EVENT(state, event) {
    state.currentEvent = event;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState());
  },

  SET_PREVIEW_EVENTS(state, events) {
    state.previewEvents = events;
  },
};
