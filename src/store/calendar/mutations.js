/* eslint-disable no-param-reassign */

export default {
  SET_CURRENTLY_FOCUSED_EVENT_ID(state, newEventId) {
    state.currentlyFocusedEventId = newEventId;
  },
  SET_CURRENT_CALENDAR_CATEGORIES(state, newCategories) {
    state.currentCalendarCategories = newCategories;
  },

  SET_CALENDARS(state, calendars) {
    state.allCalendars = calendars;
  },
};
