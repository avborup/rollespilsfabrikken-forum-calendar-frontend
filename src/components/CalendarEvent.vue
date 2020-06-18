<template>
  <router-link
    :to="{
      name: 'event-viewer',
      params: {
        calendarId: event.parent.id,
        eventId: event.id,
      },
      query: {
        date: event.start.toISOString(),
      },
    }"
    title="Se begivenhed"
  >
    <div
      class="event-container"
      :style="{ backgroundColor: event.parent.colour }"
    >
      <p>{{ event.title }}</p>
    </div>
  </router-link>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CalendarEvent',

  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  methods: {
    ...mapActions('calendar', [
      'updateCurrentlyFocusedEventId',
    ]),
  },

  computed: {
    ...mapGetters('calendar', [
      'getCategoryColour',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

a {
  text-decoration: none;
}

.event-container {
  background-color: $primary-accent;
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
  margin-top: 0.3rem;
  cursor: pointer;

  p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #fff;
    font-size: 0.8rem;
    text-align: left;
  }
}
</style>
