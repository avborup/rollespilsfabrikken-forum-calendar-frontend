<template>
  <div class="not-found-wrapper">
    <h1>Siden blev ikke fundet!</h1>
    <router-link :to="{ name: 'home' }">Tilbage til hovedsiden?</router-link>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.not-found-wrapper {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  a {
    margin-top: 1rem;
    color: $primary-text;
  }
}
</style>
