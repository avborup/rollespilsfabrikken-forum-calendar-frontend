<template>
  <div>
    <div class="event-creator-view-wrapper">
      <h1>Ny begivenhed</h1>
      <CalendarEventCreator
        @submit="handleCreateEvent"
        ref="eventCreator"
        :btnMsg="'Opret begivenhed'"
      />
    </div>
  </div>
</template>

<script>
import CalendarEventCreator from '@/components/CalendarEventCreator.vue';
import { OverlappingEventsError } from '@/api/errors';

export default {
  name: 'CalendarEventCreatorView',

  components: {
    CalendarEventCreator,
  },

  data() {
    return {
      isLoading: true,
    };
  },

  methods: {
    async handleCreateEvent(eventInfo) {
      this.$refs.eventCreator.setLoading(true);

      try {
        await this.$store.dispatch('calendar/checkEvent', { eventInfo });
      } catch (err) {
        if (err instanceof OverlappingEventsError) {
          try {
            await this.$dialog.confirm('Begivenheden, du er ved at oprette, overlapper med en anden begivenhed i den samme kalender. Er du sikker på, at du vil oprette denne begivenhed?');
          } catch (e) {
            this.$refs.eventCreator.setLoading(false);
            return;
          }
        }
      }

      try {
        const event = await this.$store.dispatch('calendar/createEvent', eventInfo);

        this.$store.dispatch('calendar/resetLoadedEvents');

        this.$router.push({
          name: 'event-viewer',
          params: {
            calendarId: eventInfo.calendarId,
            eventId: event.id,
          },
          query: {
            date: event.start,
          },
        });
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl');
      }
      this.$refs.eventCreator.setLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.event-creator-view-wrapper {
  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
}

@media (min-width: 600px) {
  .event-creator-view-wrapper {
    width: 600px;
  }
}
</style>
