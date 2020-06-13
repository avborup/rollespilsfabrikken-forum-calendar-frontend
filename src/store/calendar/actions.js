import * as calendarApi from '@/api/calendarApi';
import { getAllMonthsBetween, hourJump } from '@/dateUtils';

export default {
  updateCurrentlyFocusedEventId(context, eventId) {
    context.commit('SET_CURRENTLY_FOCUSED_EVENT_ID', eventId);
  },

  updateCurrentlyShownCalendars(context, newCalendars) {
    context.commit('SET_CURRENTLY_SHOWN_CALENDARS', newCalendars);
  },

  async fetchAllCalendars(context) {
    const { authToken } = context.rootState.auth;
    const calendars = await calendarApi.fetchAllCalendars(authToken);

    context.commit('SET_CALENDARS', calendars);
    context.commit('SET_CURRENTLY_SHOWN_CALENDARS', calendars);
  },

  async fetchAllEventsBetweenMonths(context, { earliest, latest }) {
    const rangeToLoad = context.getters.getRangeToLoad(earliest, latest);

    if (!rangeToLoad) {
      return;
    }

    const { start, end } = rangeToLoad;

    const loadedMonths = getAllMonthsBetween(start, hourJump(end, -1));
    context.commit('REGISTER_LOADED_MONTHS', loadedMonths);

    const { authToken } = context.rootState.auth;
    const events = await calendarApi.fetchAllEventsInRange(authToken, start, end);

    context.commit('ADD_EVENTS', events);
  },

  resetLoadedEvents(context) {
    context.commit('RESET_LOADED_EVENTS');
  },

  async fetchEvent(context, { calendarId, eventId, date }) {
    const { authToken } = context.rootState.auth;
    const event = await calendarApi.fetchEvent(authToken, calendarId, eventId, date);

    context.commit('SET_EVENT', event);
  },

  async createEvent(context, eventInfo) {
    const { authToken } = context.rootState.auth;
    const event = await calendarApi.createEvent(authToken, eventInfo);

    return event;
  },

  async editEvent(context, newEventInfo) {
    const { authToken } = context.rootState.auth;
    const newEvent = await calendarApi.editEvent(authToken, newEventInfo);

    return newEvent;
  },

  async deleteEvent(context, settings) {
    const { authToken } = context.rootState.auth;
    await calendarApi.deleteEvent(authToken, settings);
  },
};
