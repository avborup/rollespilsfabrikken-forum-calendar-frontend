export default {
  updateCurrentlyFocusedEventId(context, eventId) {
    context.commit('SET_CURRENTLY_FOCUSED_EVENT_ID', eventId);
  },
  updateCurrentCalendarCategories(context, newCategories) {
    context.commit('SET_CURRENT_CALENDAR_CATEGORIES', newCategories);
  },
};
