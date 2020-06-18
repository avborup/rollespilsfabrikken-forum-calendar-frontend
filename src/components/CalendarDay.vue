<template>
  <li class="day" :class="{ 'active-date': isActive }">
    <h6>{{ timestamp.getDate() }}</h6>
    <CalendarEvent
      v-for="event in getEventsOnDateFilteredByShownCalendar(timestamp)"
      :key="event.id"
      :event="event"
    />
  </li>
</template>

<script>
import { mapGetters } from 'vuex';
import CalendarEvent from '@/components/CalendarEvent.vue';

export default {
  name: 'CalendarDay',
  components: {
    CalendarEvent,
  },

  props: {
    timestamp: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters('calendar', [
      'getEventsOnDateFilteredByShownCalendar',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.day {
  text-align: center;
  padding: 0.5rem 0.1rem;
  overflow-y: auto;

  h6 {
    font-weight: 400;
    font-size: 0.8rem;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  &.active-date h6 {
    background-color: $primary-accent;
    color: #fff;
  }
}
</style>
