<template>
  <li class="day" :class="{ 'active-date': isActive }">
    <h6>{{ timestamp.getDate() }}</h6>
    <transition-group name="fade">
      <CalendarEvent
        v-for="event in getEventsOnDateFilteredByCategory(timestamp)"
        :key="event.id"
        :title="event.title"
        :id="event.id"
        :category="event.category"
      />
    </transition-group>
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
    ...mapGetters([
      'getEventsOnDateFilteredByCategory',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.day {
  text-align: center;
  padding: 0.5rem 0.1rem;

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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
