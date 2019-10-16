<template>
  <div class="container">
    <h4 class="category">{{ event.category }}</h4>
    <h1 class="title">{{ event.title }}</h1>
    <p class="timeframe">{{ formatTimeframe(event.timeframe) }}</p>
    <div class="fields">
      <img class="icon" src="assets/icons/desc.svg" alt="Beskrivelse" title="Beskrivelse">
      <p class="description">{{ event.desc }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isSameDay, toFormattedString } from '@/dateUtils';

export default {
  name: 'CalendarEventViewer',

  // FIXME: Handle errors if event is invalid in some way
  computed: {
    ...mapGetters({
      event: 'getCurrentlyFocusedEvent',
    }),
  },

  methods: {
    formatTimeframe({ start, end }) {
      const startStr = toFormattedString(start);

      if (isSameDay(start, end)) {
        const [, endStr] = toFormattedString(end).split('kl. ');
        return `${startStr}–${endStr}`;
      }

      const endStr = toFormattedString(end);
      return `${startStr} – ${endStr}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.container {
  margin: 0.8rem;
}

.category {
  // FIXME: Change background colour according to category colour
  color: #fff;
  background-color: $primary-accent;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-weight: 400;
  width: fit-content;
}

.title {
  font-weight: 700;
  font-size: 1.75rem;
  margin-top: 1rem;
  line-height: 1.75rem;
  color: $primary-text;
}

.timeframe {
  margin-top: 0.5rem;
  color: $primary-text;
}

.fields {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  grid-column-gap: 0.5rem;

  .icon {
    width: 1.3rem;
    margin: 0 auto 0 auto;
  }
}

.description {
  font-size: 0.95rem;
  color: $primary-text;
}

@media (min-width: 600px) {
  .container {
    width: 600px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
