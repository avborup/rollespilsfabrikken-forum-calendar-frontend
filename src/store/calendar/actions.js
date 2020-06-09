import * as calendarApi from '@/api/calendarApi';

export default {
  updateCurrentlyFocusedEventId(context, eventId) {
    context.commit('SET_CURRENTLY_FOCUSED_EVENT_ID', eventId);
  },
  updateCurrentCalendarCategories(context, newCategories) {
    context.commit('SET_CURRENT_CALENDAR_CATEGORIES', newCategories);
  },

  async fetchAllCalendars(context) {
    const { authToken } = context.rootState.auth;
    const calendars = await calendarApi.fetchAllCalendars(authToken);

    context.commit('SET_CALENDARS', calendars);
  },

  async fetchEvent(context, { calendarId, eventId, date }) {
    const { authToken } = context.rootState.auth;
    const event = await calendarApi.fetchEvent(authToken, calendarId, eventId, date);

    context.commit('SET_EVENT', event);
  },
};
