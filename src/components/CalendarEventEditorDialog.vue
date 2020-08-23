<template>
  <div class="dg-view-wrapper">
    <button @click="cancel" class="close-button">
      <span>&times;</span>
    </button>
    <CalendarEventCreator
      @submit="handleEditorSubmit"
      :editMode="true"
      ref="eventCreator"
      :initialValues="initialValues"
      :eventId="eventId"
      btnMsg="Opdatér begivenhed"
    />
  </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import store from '@/store/store';
import { recurringTypes } from '@/api/constants';
import { OverlappingEventsError } from '@/api/errors';
import { toDoubleDigitHrMinStr, formatYMD } from '@/dateUtils';
import CalendarEventCreator from '@/components/CalendarEventCreator.vue';

export default {
  name: 'CalendarEventEditorDialog',

  components: {
    CalendarEventCreator,
  },

  mixins: [
    // This mixin includes the methods `proceed` and `cancel` to interface with
    // the dialog window. Also provides the `loading` property. For a full reference,
    // see the mixin source code at: https://github.com/Godofbrowser/vuejs-dialog/blob/master/src/plugin/js/mixins/dialog-mixin.js
    DialogMixin,
  ],

  data() {
    const event = store.state.calendar.currentEvent;

    return {
      initialValues: {
        eventTitle: event.title,
        eventDesc: event.description,
        startDate: formatYMD(event.start),
        startTime: toDoubleDigitHrMinStr(event.start.getHours(), event.start.getMinutes()),
        endDate: formatYMD(event.end),
        endTime: toDoubleDigitHrMinStr(event.end.getHours(), event.end.getMinutes()),
        recurringType: recurringTypes.find(r => r.real === event.recurrence.type),
        recEndDate: event.recurrence.end ? formatYMD(event.recurrence.end) : '',
        selectedCalendar: event.parent,
      },
      eventId: event.id,
    };
  },

  methods: {
    async handleEditorSubmit(newEventInfo) {
      this.$refs.eventCreator.setLoading(true);

      try {
        await store.dispatch('calendar/checkEvent', {
          eventInfo: newEventInfo,
          ignoreIds: [this.eventId],
        });
      } catch (err) {
        if (err instanceof OverlappingEventsError) {
          try {
            await this.$dialog.confirm('Begivenheden, du er ved at redigere, kommer til at overlappe med en anden begivenhed i den samme kalender. Er du sikker på, at du vil gemme ændringerne for denne begivenhed?');
          } catch (e) {
            this.$refs.eventCreator.setLoading(false);
            return;
          }
        }
      }

      try {
        const newEvent = await store.dispatch('calendar/editEvent', newEventInfo);
        store.dispatch('calendar/resetLoadedEvents');
        this.proceed(newEvent);
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl');
      }
      this.$refs.eventCreator.setLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.dg-view-wrapper {
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}

.close-button {
  border: none;
  background: none;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
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
</style>
