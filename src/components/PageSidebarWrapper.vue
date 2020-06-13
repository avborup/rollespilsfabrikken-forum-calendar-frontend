<template>
  <div>
    <transition name="open-sidebar-fade">
      <div v-if="isOpen" class="darkened-bg" @click="closeSidebar"></div>
    </transition>
    <transition name="open-sidebar-slide">
      <PageSidebar v-if="isOpen" class="sidebar" @close-sidebar="closeSidebar" />
    </transition>
  </div>
</template>

<script>
import PageSidebar from '@/components/PageSidebar.vue';

export default {
  name: 'PageSidebarWrapper',
  components: {
    PageSidebar,
  },

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
.sidebar, .darkened-bg {
  position: fixed;
  z-index: 100;
  height: 100vh;
  top: 0;
  left: 0;
}

.darkened-bg {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
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
