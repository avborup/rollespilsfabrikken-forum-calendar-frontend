<template>
  <div class="container">
    <div v-if="eventExists && !errorOccurred">
      <div v-if="!isLoading">
        <router-link
          :to="{
            name: 'calendar',
            query: {
              month: event.start.getMonth() + 1,
              year: event.start.getFullYear(),
            },
          }"
          title="Luk begivenhed"
        >
          <button class="close-event-button">
            <span>&times;</span>
          </button>
        </router-link>
        <h4 class="category" :style="{ backgroundColor: calendar.colour }">{{ calendar.name }}</h4>
        <h1 class="title">{{ event.title }}</h1>
        <p class="timeframe">{{ formatTimeframe(event.start, event.end) }}</p>
        <div class="fields">
          <img class="icon" src="assets/icons/desc.svg" alt="Beskrivelse" title="Beskrivelse">
          <p class="description">{{ event.description }}</p>
        </div>
      </div>
      <div v-else class="loading">
        <LoadingSpinner />
      </div>
    </div>
    <div v-else-if="!eventExists" class="event-not-found">
      <h1>Begivenhed findes ikke</h1>
      <p>Begivenheden, du leder efter, er ikke tilgængelig.</p>
      <p class="attempted-event">{{ $route.params.eventId }}</p>
    </div>
    <div v-else class="error-occurred">
      <h1>Der opstod en fejl</h1>
      <p>Begivenheden kunne ikke indlæses.</p>
      <p class="attempted-event">{{ $route.params.eventId }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isSameDay, toFormattedString } from '@/dateUtils';
import { ResourceNotFoundError } from '@/api/errors';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'CalendarEventViewer',

  components: {
    LoadingSpinner,
  },

  data() {
    return {
      eventExists: true,
      isLoading: true,
      errorOccurred: false,
    };
  },

  computed: {
    ...mapState('calendar', {
      event: 'currentEvent',
      // Anything using allCalendars is temporary. In the future, the belonging
      // calendar will be returned in the REST call as well.
      allCalendars: 'allCalendars',
    }),

    calendar() {
      const { calendarId } = this.$route.params;
      return this.$store.getters['calendar/getCalendarFromId'](calendarId);
    },
  },

  methods: {
    formatTimeframe(start, end) {
      const startStr = toFormattedString(start);

      if (isSameDay(start, end)) {
        const [, endStr] = toFormattedString(end).split('kl. ');
        return `${startStr}–${endStr}`;
      }

      const endStr = toFormattedString(end);
      return `${startStr} – ${endStr}`;
    },

    async fetchEvent() {
      this.eventExists = true;
      this.isLoading = true;
      this.errorOccurred = false;

      if (!this.allCalendars) {
        return;
      }

      const { eventId, calendarId } = this.$route.params;
      const date = new Date(this.$route.query.date);

      try {
        await this.$store.dispatch('calendar/fetchEvent', { calendarId, eventId, date });
      } catch (err) {
        if (err instanceof ResourceNotFoundError) {
          this.eventExists = false;
        }

        this.errorOccurred = true;
      }

      this.isLoading = false;
    },
  },

  watch: {
    allCalendars() {
      this.fetchEvent();
    },

    $route() {
      this.fetchEvent();
    },
  },

  created() {
    if (!this.allCalendars) {
      this.$store.dispatch('calendar/fetchAllCalendars');
    }

    this.fetchEvent();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.container {
  margin: 0.8rem 1rem;
}

.close-event-button {
  float: right;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  margin: 0;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;

  span {
    position: absolute;
    color: rgba(0, 0, 0, 0.6);
    font-size: 2rem;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-55%);
    font-weight: 300;
  }
}

.category {
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

.loading {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-not-found, .error-occurred {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(0, 0, 0, 0.75);
    margin-bottom: 1rem;

    &.attempted-event {
      font-family: monospace;
    }
  }
}

@media (min-width: 600px) {
  .container {
    width: 600px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
