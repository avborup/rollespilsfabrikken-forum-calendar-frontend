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

<style lang="scss">
.md-content {
  overflow-y: auto;
}

*.md-content {
  p, ul:not(:last-child), ol:not(:last-child), pre,
  h1, h2, h3, h4, h5, h6, table, hr {
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 1rem;
  }

  code {
    font-size: 0.9rem;
  }

  h1, h2, h3, h4, h5, h6 {
    &:not(:first-child) {
      margin-top: 1rem;
    }
  }

  ul p, ol p {
    margin-bottom: 0.25rem;
  }

  pre, p > code {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.025);
    border-radius: 0.25rem;
  }

  pre {
    padding: 0.75rem;
  }

  p > code {
    padding: 0.25rem 0.4rem;
  }

  ul, ol {
    padding-left: 2rem;
  }

  blockquote {
    border-left: 0.2rem solid rgba(0, 0, 0, 0.1);
    padding-left: 1rem;
    font-style: italic;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;

    td, th {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 0.3rem 0.5rem;
    }
  }

  .katex-display {
    display: flex;
    justify-content: center;
  }
}
</style>
