import { dateRangesOverlap } from '@/dateUtils';

export default {
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

  getEventsOnDateFilteredByCategory: (state, getters) => (date) => {
    const allEvents = getters.getEventsOnDate(date);
    const categories = state.currentCalendarCategories;

    return allEvents.filter(({ category }) => categories.includes(category));
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

  getCurrentCalendarCategories(state) {
    return state.currentCalendarCategories;
  },
};
