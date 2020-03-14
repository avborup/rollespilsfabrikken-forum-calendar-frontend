<template>
  <div id="app">
    <header class="header">
      <button class="open-sidebar-button" @click="openSidebar" title="Åben sidebjælke">
        <img src="assets/icons/sidebar.svg">
      </button>
      <div class="page-title">
        <img
          class="logo"
          src="/assets/icons/rollespilsfabrikken.svg"
          alt="Rollespilsfabrikkens logo"
        >
        Rollespilsfabrikken
      </div>
    </header>
    <PageSidebarWrapper class="sidebar-wrapper" ref="sidebar" />
    <PageSidebar class="sidebar" />
    <transition name="fade" mode="out-in">
      <router-view class="main-content" />
    </transition>
  </div>
</template>

<script>
import PageSidebar from '@/components/PageSidebar.vue';
import PageSidebarWrapper from '@/components/PageSidebarWrapper.vue';

export default {
  name: 'App',
  components: {
    PageSidebar,
    PageSidebarWrapper,
  },

  methods: {
    openSidebar() {
      this.$refs.sidebar.openSidebar();
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/theme.scss';

#app {
  font-family: $fonts;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100%;

  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.header {
  grid-area: header;

  .open-sidebar-button {
    border: none;
    background: none;
    cursor: pointer;
  }

  .open-sidebar-button {
    padding: 0.1rem;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  height: 3rem;
  background-color: $primary-accent;
  color: #fff;
  padding: 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  grid-column-gap: 1rem;

  .page-title {
    display: flex;
    align-items: center;

    .logo {
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
    }
  }
}

.sidebar {
  grid-area: sidebar;
  display: none;
}

.main-content {
  grid-area: main;
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

@media (min-width: 1000px) {
  .open-sidebar-button {
    display: none;
  }

  .sidebar {
    display: block;
  }

  .sidebar-wrapper {
    display: none;
  }
}
</style>
