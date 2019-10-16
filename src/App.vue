<template>
  <div id="app">
    <nav class="temp-spacer">Kalender</nav>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/theme.scss';

#app {
  font-family: $fonts;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100%;

  display: grid;
  grid-template-rows: auto 1fr;
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.temp-spacer {
  height: 3rem;
  background-color: $primary-accent;
  color: #fff;
  padding: 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
