<template>
  <div v-if="!isWaiting" class="event-creator-wrapper">
    <form @submit="handleSubmit">
      <div v-if="!editMode" class="form-field" :class="{ 'is-error': calendarErr.has }">
        <label>Kalender</label>
        <multiselect
          v-model="selectedCalendar"
          :options="calendarOptions"
          label="name"
          track-by="id"
          selectLabel="Tryk på 'enter' for at vælge"
          selectedLabel="Valgt"
          deselectLabel="Tryk på 'enter' for at fravælge"
          placeholder="Vælg kalender"
        />
        <span v-if="calendarErr.has" class="field-error-msg">{{ calendarErr.msg }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': titleErr.has }">
        <label for="event-title">Titel</label>
        <input v-model="eventTitle" type="text" name="event-title">
        <span v-if="titleErr.has" class="field-error-msg">{{ titleErr.msg }}</span>
      </div>
      <div class="form-field">
        <label for="event-desc">Beskrivelse</label>
        <input v-model="eventDesc" type="text" name="event-desc">
      </div>
      <div class="form-field" :class="{ 'is-error': startErr.has }">
        <label>Start</label>
        <div class="row">
          d.
          <input v-model="startDate" type="date">
          kl.
          <input v-model="startTime" type="time">
        </div>
        <span v-if="startErr.has" class="field-error-msg">{{ startErr.msg }}</span>
      </div>
      <div class="form-field" :class="{ 'is-error': endErr.has }">
        <label>Slut</label>
        <div class="row">
          d.
          <input v-model="endDate" type="date">
          kl.
          <input v-model="endTime" type="time">
        </div>
        <span v-if="endErr.has" class="field-error-msg">{{ endErr.msg }}</span>
      </div>
      <div class="form-field">
        <label>Gentag</label>
        <multiselect
          v-model="recurringType"
          :options="recurringTypes"
          label="text"
          track-by="real"
          selectLabel="Tryk på 'enter' for at vælge"
          selectedLabel="Valgt"
          deselectLabel=""
          :searchable="false"
          :allow-empty="false"
        />
      </div>
      <div v-if="isRecurring" class="form-field">
        <label>Gentag indtil</label>
        <p>Efterlad blank, hvis begivenheden skal gentages for evigt.</p>
        <div class="row">
          d.
          <input v-model="recEndDate" type="date">
          <button @click="clearRecurringEnd" type="button" class="clear-rec-end">
            <span class="fas fa-backspace icon"></span>
          </button>
        </div>
      </div>
      <div v-if="isRecurring && editMode" class="form-field">
        <label>Gem for</label>
        <multiselect
          v-model="saveFor"
          :options="saveForOptions"
          label="text"
          track-by="text"
          selectLabel=""
          selectedLabel=""
          deselectLabel=""
          :searchable="false"
          :allow-empty="false"
          class="save-for-multiselect"
        />
      </div>
      <input class="form-submit" type="submit" :value="btnMsg">
    </form>
  </div>
  <div v-else class="waiting">
    <LoadingSpinner />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import store from '@/store/store';
import { recurringTypes, affectRecurrenceOptions } from '@/api/constants';
import {
  now,
  toDoubleDigitHrMinStr,
  formatYMD,
  hourJump,
} from '@/dateUtils';

export default {
  name: 'CalendarEventCreator',

  components: {
    Multiselect,
    LoadingSpinner,
  },

  props: {
    initialValues: {
      type: Object,
      default: () => {
        const nowDate = now();
        const hourLater = hourJump(nowDate, 1);

        return {
          eventTitle: '',
          eventDesc: '',
          startDate: formatYMD(nowDate),
          startTime: toDoubleDigitHrMinStr(nowDate.getHours(), nowDate.getMinutes()),
          endDate: formatYMD(hourLater),
          endTime: toDoubleDigitHrMinStr(hourLater.getHours(), hourLater.getMinutes()),
          recurringType: recurringTypes[0],
          recEndDate: '',
          selectedCalendar: null,
        };
      },
    },

    editMode: {
      type: Boolean,
      default: false,
    },

    btnMsg: {
      type: String,
      default: 'Fortsæt',
    },

    eventId: {
      default: null,
    },
  },

  data() {
    return {
      ...this.initialValues,
      recurringTypes,
      isWaiting: false,
      saveFor: affectRecurrenceOptions[0],
      saveForOptions: affectRecurrenceOptions,
      titleErr: {
        has: false,
        msg: '',
      },
      startErr: {
        has: false,
        msg: '',
      },
      endErr: {
        has: false,
        msg: '',
      },
      calendarErr: {
        has: false,
        msg: '',
      },
    };
  },

  computed: {
    ...mapState('calendar', [
      'allCalendars',
    ]),

    isRecurring() {
      return this.recurringType.real !== 'none';
    },

    calendarOptions() {
      const cals = store.getters['calendar/getCalendarsWhereCanAddEvents'];

      return cals !== null ? cals : [];
    },
  },

  methods: {
    handleSubmit(event) {
      event.preventDefault();

      this.titleErr.has = false;
      this.startErr.has = false;
      this.endErr.has = false;
      this.calendarErr.has = false;

      if (this.eventTitle.trim().length === 0) {
        this.titleErr.has = true;
        this.titleErr.msg = 'Begivenheden skal have en titel';
      }

      if (!this.selectedCalendar && !this.editMode) {
        this.calendarErr.has = true;
        this.calendarErr.msg = 'Vælg venligst den kalender, din begivenhed skal oprettes under';
      }

      const [sYear, sMonth, sDate, sHr, sMin] = [
        ...this.startDate.split('-'),
        ...this.startTime.split(':'),
      ].map(n => Number.parseInt(n, 10));
      const start = new Date(sYear, sMonth - 1, sDate, sHr, sMin);

      const [eYear, eMonth, eDate, eHr, eMin] = [
        ...this.endDate.split('-'),
        ...this.endTime.split(':'),
      ].map(n => Number.parseInt(n, 10));
      const end = new Date(eYear, eMonth - 1, eDate, eHr, eMin);

      if (Number.isNaN(start.getTime())) {
        this.startErr.has = true;
        this.startErr.msg = 'Udfyld venligst både dato og tidspunkt';
      }

      if (Number.isNaN(end.getTime())) {
        this.endErr.has = true;
        this.endErr.msg = 'Udfyld venligst både dato og tidspunkt';
      }

      if (this.startErr.has || this.endErr.has) {
        return;
      }

      if (start > end) {
        this.endErr.has = true;
        this.endErr.msg = 'Sluttidspunktet må ikke være før starttidspunktet';
        return;
      }

      if (this.titleErr.has || this.calendarErr.has) {
        return;
      }

      const [rYear, rMonth, rDate] = this.recEndDate.split('-').map(n => Number.parseInt(n, 10));
      let recEnd = new Date(rYear, rMonth - 1, rDate);

      if (Number.isNaN(recEnd.getTime())) {
        recEnd = null;
      }

      this.$emit('submit', {
        title: this.eventTitle,
        description: this.eventDesc,
        start,
        end,
        isRecurring: this.isRecurring,
        recurringEnd: recEnd,
        recurringType: this.recurringType.real,
        calendarId: this.selectedCalendar.id,
        saveSettings: {
          series: this.saveFor.series,
          applyToAll: this.saveFor.applyToAll,
        },
        eventId: this.eventId,
      });
    },

    clearRecurringEnd() {
      this.recEndDate = '';
    },

    setLoading(value) {
      this.isWaiting = value;
    },
  },

  created() {
    if (!this.editMode && !store.state.calendar.allCalendars) {
      store.dispatch('calendar/fetchAllCalendars');
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.event-creator-wrapper {
  h1 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .form-field {
    margin-bottom: 1rem;

    label {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      display: block;
    }

    p {
      color: #35495e;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    input[type='text'], input[type='date'], input[type='time'] {
      border-radius: 5px;
      border: 1px solid #e8e8e8;
      font-family: $fonts;
      color: #35495e;
      background-color: #fff;
    }

    input[type='text'] {
      width: 100%;
      font-size: 1rem;
      padding: 13px;
      height: 40px;
    }

    input[type='date'], input[type='time'] {
      padding: 0.25rem;
      font-size: 1rem;
    }

    .row {
      color: #35495e;
      font-size: 0.9rem;
      display: flex;
      column-gap: 0.5rem;
      align-items: center;
    }

    &.is-error {
      input[type='text'], input[type='date'], input[type='time'] {
        border-color: $err-colour;
      }
    }

    &.is-error > .multiselect {
      border: 1px solid $err-colour;
      border-radius: 5px;
    }

    .field-error-msg {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: $err-colour;
    }

    .clear-rec-end {
      border: none;
      background: none;
      cursor: pointer;

      .icon {
        color: #35495e;
        font-size: 1rem;
      }
    }
  }

  .form-submit {
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.2rem;
    border: none;
    background-color: $primary-accent;
    color: #fff;
    cursor: pointer;
    font-family: $fonts;
    font-size: 0.9rem;
    margin: 0 auto;
    display: block;
    margin-bottom: 1rem;
  }

  .two-column {
    display: flex;
    column-gap: 1.5rem;
  }
}

.waiting {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss">
.event-creator-wrapper .save-for-multiselect .multiselect__element > .multiselect__option {
  white-space: normal;
}
</style>
