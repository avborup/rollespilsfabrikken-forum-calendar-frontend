<template>
  <div>
    <ul>
      <li
        v-for="weekDay in weekDays"
        :key="weekDay"
        class="weekday-name"
      >
        <h5>{{ weekDay }}</h5>
      </li>
      <li
        v-for="emptyDay in gridInfo.firstDay"
        :key="-1 * emptyDay"
        class="empty-field"
      ></li>
      <li
        v-for="date in gridInfo.numDays"
        :key="date"
        class="day"
        :class="{
          'active-date': isSameDay(
            activeDate,
            new Date(timestamp.getFullYear(), timestamp.getMonth(), date),
          ),
        }"
      >
        <h6>{{ date }}</h6>
      </li>
      <li
        v-for="emptyDay in gridInfo.numLeftOverFields"
        :key="100 - emptyDay"
        class="empty-field"
      ></li>
    </ul>
  </div>
</template>

<script>
import { weekDayNames } from '@/constants';
import {
  today,
  daysInMonth,
  getWeekday,
  // FIXME: Why does ESLint complain that `isSameDay` doesn't exist?
  // eslint-disable-next-line
  isSameDay,
} from '@/dateUtils';

export default {
  name: 'CalendarGrid',

  props: {
    timestamp: {
      type: Date,
      default: today,
    },
    activeDate: {
      type: Date,
      default: today,
    },
  },

  data() {
    const year = this.timestamp.getFullYear();
    const month = this.timestamp.getMonth();

    const numDays = daysInMonth(month, year);
    const firstDay = getWeekday(year, month, 1);
    const numUsedFields = numDays + firstDay;
    const numWeeks = Math.ceil(numUsedFields / 7);
    const numLeftOverFields = numWeeks * 7 - numUsedFields;
    const weekDays = weekDayNames.map(weekDay => weekDay.replace(/dag/g, ''));

    return {
      weekDays,
      gridInfo: {
        numDays,
        numWeeks,
        firstDay,
        numLeftOverFields,
      },
    };
  },

  methods: {
    updateTimestamp(newTimestamp) {
      this.currentTimestamp = newTimestamp;
    },

    isSameDay(a, b) {
      return isSameDay(a, b);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

$border-style: 1px solid #ccc;

ul {
  list-style-type: none;
  display: grid;
  height: 100%;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 2rem auto;
  border-right: $border-style;
  /* border-top: $border-style; */

  .weekday-name {
    border-bottom: $border-style;
    display: flex;
    align-items: center;
    justify-content: center;

    h5 {
      text-transform: uppercase;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 600;
    }
  }

  .empty-field {
    border-left: $border-style;
    border-bottom: $border-style;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .day {
    border-left: $border-style;
    border-bottom: $border-style;
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
}
</style>
