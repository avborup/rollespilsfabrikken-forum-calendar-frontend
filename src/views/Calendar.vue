<template>
  <div class="calendar">
    <header>
      <button title="Forrige måned" @click="decrementMonth">
        <img src="assets/icons/less-than.svg" alt="Forrige måned">
      </button>
      <h2>{{ monthName }} {{ viewTimestamp.getFullYear() }}</h2>
      <button title="Næste måned" @click="incrementMonth">
        <img src="assets/icons/less-than.svg" alt="Næste måned" class="next-month-icon">
      </button>
    </header>
    <transition name="slide" @before-enter="setSlidingClass">
      <CalendarGrid
        :timestamp="viewTimestamp"
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
import { mapState } from 'vuex';
import CalendarGrid from '@/components/CalendarGrid.vue';
import { monthNames } from '@/constants';
import { today, monthJump } from '@/dateUtils';

export default {
  name: 'Calendar',
  components: {
    CalendarGrid,
  },

  data() {
    return {
      viewTimestamp: today(),
      slideDir: 1,
    };
  },

  computed: {
    monthName() {
      return monthNames[this.viewTimestamp.getMonth()];
    },

    ...mapState('calendar', [
      'allCalendars',
    ]),
  },

  methods: {
    incrementMonth() {
      this.slideDir = 1;
      const newTimestamp = monthJump(this.viewTimestamp, 1);

      this.$router.push({
        name: 'calendar',
        query: {
          year: newTimestamp.getFullYear(),
          month: newTimestamp.getMonth() + 1,
        },
      });
    },

    decrementMonth() {
      this.slideDir = -1;
      const newTimestamp = monthJump(this.viewTimestamp, 1, -1);

      this.$router.push({
        name: 'calendar',
        query: {
          year: newTimestamp.getFullYear(),
          month: newTimestamp.getMonth() + 1,
        },
      });
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

    setTimestampFromRoute() {
      const route = this.$route;

      if (route.query.month === undefined && route.query.year === undefined) {
        return;
      }

      const month = Number.parseInt(route.query.month, 10);
      const year = Number.parseInt(route.query.year, 10);

      const monthIsValid = !Number.isNaN(month) && month <= 12 && month > 0;
      const yearIsValid = !Number.isNaN(year);

      if (!monthIsValid || !yearIsValid) {
        return;
      }

      this.viewTimestamp = new Date(year, month - 1);
    },

    async fetchEvents() {
      if (!this.allCalendars) {
        return;
      }

      // This variable controls how many months before and after the current month
      // will be loaded. A value of 3 would fetch 7 months in total: this month,
      // the 3 months before and the 3 months after.
      const monthRadius = 3;
      const earliest = monthJump(this.viewTimestamp, monthRadius, -1);
      const latest = monthJump(this.viewTimestamp, monthRadius);

      try {
        await this.$store.dispatch('calendar/fetchAllEventsBetweenMonths', { earliest, latest });
      } catch (err) {
        this.$dialog.alert('Vi beklager, men der opstod en fejl. Eventuelt kan du genindlæse siden og prøve igen.');
      }
    },
  },

  watch: {
    $route() {
      this.setTimestampFromRoute();
      this.fetchEvents();
    },

    allCalendars() {
      this.fetchEvents();
    },
  },

  created() {
    if (!this.allCalendars) {
      this.$store.dispatch('calendar/fetchAllCalendars');
    }

    this.setTimestampFromRoute();
    this.fetchEvents();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
@import '@/assets/scss/consts.scss';

.calendar {
  display: grid;
  grid-template-rows: $header-height 1fr;
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
      color: $primary-text;
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

// .slide-enter-active, .slide-leave-active {
//   transition: transform 0.3s ease-in-out;
//   /* FIXME: Is this a good solution? */
//   position: absolute;
//   padding-top: $header-height;
//   width: 100%;
//   height: 100%;
// }

// .slide-leave-to.slide-next, .slide-enter.slide-prev {
//   transform: translateX(-100%);
// }

// .slide-enter.slide-next, .slide-leave-to.slide-prev {
//   transform: translateX(100%);
// }
</style>
