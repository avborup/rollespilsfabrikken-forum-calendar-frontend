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
    <transition name="slide" @before-enter="setSlidingClass">
      <CalendarGrid
        :timestamp="currentTimestamp"
        :activeDate="activeDate"
        :key="currentTimestamp.toLocaleString()"
        ref="calendarContent"
        :class="{
          'slide-next': slideDir === 1,
          'slide-prev': slideDir === -1,
        }"
      />
    </transition>
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
      slideDir: 1,
    };
  },

  methods: {
    incrementMonth() {
      this.slideDir = 1;
      this.currentTimestamp = monthJump(this.currentTimestamp, 1);
      this.updateCalendar();
    },

    decrementMonth() {
      this.slideDir = -1;
      this.currentTimestamp = monthJump(this.currentTimestamp, 1, -1);
      this.updateCalendar();
    },

    updateCalendar() {
      this.currentMonth = this.currentTimestamp.getMonth();
      this.currentMonthName = monthNames[this.currentMonth];

      this.$refs.calendarContent.updateTimestamp(this.currentTimestamp);
    },

    // Manually add and remove classes signifying which direction sliding should
    // occur BEFORE the transition starts. Adding a binding attribute such as
    // :class="{
    //   'slide-next': slideDir === 1,
    //   'slide-prev': slideDir === -1,
    // }"
    // to the CalendarGrid does not work alone, because the class is applied
    // after the transition has completed, but it does work in conjunction with
    // this method being called before the transition starts.
    setSlidingClass() {
      const classToAdd = this.slideDir === 1 ? 'slide-next' : 'slide-prev';
      const classToRemove = this.slideDir === -1 ? 'slide-next' : 'slide-prev';

      this.$refs.calendarContent.$el.classList.remove(classToRemove);
      this.$refs.calendarContent.$el.classList.add(classToAdd);
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: 3rem;

.calendar {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  position: relative;
  overflow-x: hidden;

  header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    padding: 0.5rem 2rem;
    align-items: center;
    justify-content: center;
    height: $header-height;

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

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease-in-out;
  /* FIXME: Is this a good solution? */
  position: absolute;
  margin-top: $header-height;
  width: 100%;
  height: calc(100% - #{$header-height});
}

.slide-leave-to.slide-next, .slide-enter.slide-prev {
  transform: translateX(-100%);
}

.slide-enter.slide-next, .slide-leave-to.slide-prev {
  transform: translateX(100%);
}
</style>
