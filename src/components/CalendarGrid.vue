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
      <CalendarDay
        v-for="date in gridInfo.numDays"
        :key="date"
        class="day"
        :timestamp="new Date(timestamp.getFullYear(), timestamp.getMonth(), date)"
        :isActive="isSameDay(
          activeDate,
          new Date(timestamp.getFullYear(), timestamp.getMonth(), date),
        )"
      />
      <li
        v-for="emptyDay in gridInfo.numLeftOverFields"
        :key="100 - emptyDay"
        class="empty-field"
      ></li>
    </ul>
  </div>
</template>

<script>
import CalendarDay from '@/components/CalendarDay.vue';
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
  components: {
    CalendarDay,
  },

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
  }
}
</style>
