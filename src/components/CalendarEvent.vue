<template>
  <div class="event-container">
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'CalendarEvent',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.event-container {
  background-color: $primary-accent;
  border-radius: 0.2rem;
  padding: 0.2rem 0.4rem;
  margin-top: 0.3rem;

  p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #fff;
    font-size: 0.8rem;
    text-align: left;
  }
}
</style>
