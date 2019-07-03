<template>
  <li class="day" :class="{ 'active-date': isActive }">
    <h6>{{ date }}</h6>
  </li>
</template>

<script>
import { today } from '@/dateUtils';

export default {
  name: 'CalendarDay',
  
  props: {
    date: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.day {
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
</style>
