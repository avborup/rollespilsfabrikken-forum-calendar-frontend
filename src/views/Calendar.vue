<template>
  <div class="calendar">
    <header>
      <button title="Forrige måned" @click="decrementMonth">
        <img src="assets/icons/less-than.svg" alt="Forrige måned">
      </button>
      <h2>{{ currentMonthName }} {{ currentTimestamp.getFullYear() }}</h2>
      <button title="Næste måned" @click="incrementMonth">
        <img src="assets/icons/less-than.svg" alt="Næste måned" class="next-month-icon">
      </button>
    </header>
    <CalendarGrid
      :timestamp="currentTimestamp"
      :activeDate="activeDate"
      :key="currentTimestamp.toLocaleString()"
      ref="calendarContent"
    />
  </div>
</template>

<script>
import CalendarGrid from '@/components/CalendarGrid.vue';
import { monthNames } from '@/constants';
import { today, monthJump } from '@/dateUtils';

export default {
  name: 'Calendar',
  components: {
    CalendarGrid,
  },

  props: {
    initialTimestamp: {
      type: Date,
      default: today,
    },
    activeDate: {
      type: Date,
      default: today,
    },
  },

  data() {
    const { initialTimestamp } = this;
    const initialMonth = initialTimestamp.getMonth();
    const initialMonthName = monthNames[initialMonth];

    return {
      currentTimestamp: initialTimestamp,
      currentMonth: initialMonth,
      currentMonthName: initialMonthName,
    };
  },

  methods: {
    incrementMonth() {
      this.currentTimestamp = monthJump(this.currentTimestamp, 1);
      this.updateCalendar();
    },

    decrementMonth() {
      this.currentTimestamp = monthJump(this.currentTimestamp, 1, -1);
      this.updateCalendar();
    },

    updateCalendar() {
      this.currentMonth = this.currentTimestamp.getMonth();
      this.currentMonthName = monthNames[this.currentMonth];

      this.$refs.calendarContent.updateTimestamp(this.currentTimestamp);
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;

  header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    padding: 0.5rem 2rem;
    align-items: center;
    justify-content: center;

    h2 {
      text-align: center;
      font-weight: 600;
      font-size: 1.5rem;
    }

    button {
      background-color: #fff;
      border: none;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        /*user-select: none;*/

        &.next-month-icon {
          transform: rotate(180deg);
        }
      }
    }

  }
}
</style>
