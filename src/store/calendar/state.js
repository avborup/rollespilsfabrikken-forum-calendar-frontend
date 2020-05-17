import {
  testEvents,
  testCategories,
} from '@/testData';

export default () => ({
  calendarEvents: testEvents,
  calendarCategories: testCategories,
  currentCalendarCategories: testCategories.map(({ name }) => name),
  currentlyFocusedEventId: testEvents[0].id, // FIXME: Better way in the end product
});
