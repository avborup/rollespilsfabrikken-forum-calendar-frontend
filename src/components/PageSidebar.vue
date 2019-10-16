<template>
  <div>
    <button class="open-button" @click="openSidebar" title="Åben sidebjælke">
      <img src="assets/icons/sidebar.svg">
    </button>
    <transition name="open-sidebar-fade">
      <div v-if="isOpen" class="darkened-bg" @click="closeSidebar"></div>
    </transition>
    <transition name="open-sidebar-slide">
      <div v-if="isOpen" class="content">
        <div class="align-left">
          <button class="close-button" @click="closeSidebar" title="Luk sidebjælke">
            <span>&times;</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PageSidebar',

  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    openSidebar() {
      this.isOpen = true;
    },

    closeSidebar() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';

.open-button, .close-button {
  border: none;
  background: none;
  cursor: pointer;
}

.open-button {
  padding: 0.1rem;
  width: 1.5rem;
  height: 1.5rem;

  img {
    width: 100%;
    height: 100%;
  }
}

.content, .darkened-bg {
  position: absolute;
  z-index: 100;
  height: 100vh;
  top: 0;
  left: 0;
}

.darkened-bg {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
}

.content {
  background-color: #fff;
  color: $primary-text;
  width: 15rem;
  padding: 1rem;

  .close-button {
    position: relative;
    margin: 0;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;

    span {
      position: absolute;
      color: rgba(0, 0, 0, 0.6);
      font-size: 2rem;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-55%);
      font-weight: 300;
    }
  }

  .align-left {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

.open-sidebar-slide-leave-active,
.open-sidebar-slide-enter-active,
.open-sidebar-fade-leave-active,
.open-sidebar-fade-enter-active {
  transition: 0.5s;
}
.open-sidebar-slide-enter, .open-sidebar-slide-leave-to {
  transform: translate(-100%, 0);
}
.open-sidebar-fade-enter, .open-sidebar-fade-leave-to {
  opacity: 0;
}
</style>
