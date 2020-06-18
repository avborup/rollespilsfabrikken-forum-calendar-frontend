import {
  dateRangesOverlap,
  getAllMonthsBetween,
  monthJump,
} from '@/dateUtils';

export default {
  getEventsOnDate: state => (date) => {
    const dayDate = [date.getFullYear(), date.getMonth(), date.getDate()];
    const dayStart = new Date(...dayDate);
    const dayEnd = new Date(...dayDate, 23, 59);

    return state.allEvents.filter(event => dateRangesOverlap(
      dayStart,
      dayEnd,
      event.start,
      event.end,
    ));
  },

  getEventsOnDateFilteredByShownCalendar: (state, getters) => (date) => {
    const allEvents = getters.getEventsOnDate(date);
    const curCalendarIds = state.currentlyShownCalendars.map(cal => cal.id);

    return allEvents.filter(({ parent }) => curCalendarIds.includes(parent.id));
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

  getCurrentlyShownCalendars(state) {
    return state.currentlyShownCalendars;
  },

  getRangeToLoad: state => (start, end) => {
    const allMonths = getAllMonthsBetween(start, end);
    const notLoaded = allMonths.filter(month => state.loadedMonths[month] === undefined);

    const minNotLoaded = Math.min(...notLoaded);
    const maxNotLoaded = Math.max(...notLoaded);

    if (minNotLoaded === Infinity || maxNotLoaded === Infinity) {
      return null;
    }

    return {
      start: new Date(minNotLoaded),
      // We want to load the entire month, so by jumping forward to the first date
      // of the next month at midnight and then back 1 second we get the last second
      // of the current month.
      end: monthJump(new Date(maxNotLoaded), 1),
    };
  },

  getCalendarFromId: state => id => state.allCalendars.find(cal => cal.id === id),

  getCalendarsWhereCanAddEvents(state) {
    if (state.allCalendars === null) {
      return null;
    }

    return state.allCalendars.filter(cal => cal.permissions.canAddEvents);
  },
};
