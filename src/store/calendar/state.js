import {
  testEvents,
  testCategories,
} from '@/testData';

export default () => ({
  calendarEvents: testEvents,
  calendarCategories: testCategories,
  currentlyShownCalendars: [],
  currentlyFocusedEventId: testEvents[0].id, // FIXME: Better way in the end product
  allCalendars: null,
  loadedMonths: {},
  // NOTE: We can safely store all events in an array and merely push events to
  // it once they are loaded, but this is highly dependent on the fact that the
  // same month is NEVER loaded twice. Currently this is ensured because the
  // monthRadius defined in Calendar.vue is a constant, meaning that the
  // getRangeToLoad getter will never return a range where the start and end
  // wraps around an already loaded month. This comment is just left here to
  // make a potential future bug where events are duplicated easier to find.
  allEvents: [],
  currentEvent: null,
  previewEvents: [],
});
